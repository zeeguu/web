// completely the work of Claude

import { useState, useContext } from "react";
import { APIContext } from "../../contexts/APIContext";
import { UserContext } from "../../contexts/UserContext";
import * as s from "./ReplaceExampleModal.sc";
import * as exerciseStyles from "../exerciseTypes/Exercise.sc";
import LoadingAnimation from "../../components/LoadingAnimation";
import { toast } from "react-toastify";

export default function ReplaceExampleModal({
  exerciseBookmark,
  onExampleUpdated,
  renderAs = "link", // "link" or "button"
}) {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [pastContexts, setPastContexts] = useState([]);
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExample, setSelectedExample] = useState(null);
  const [saving, setSaving] = useState(false);

  // Get user's CEFR level
  const getUserCEFRLevel = () => {
    if (!userDetails?.learned_language) {
      return "B1"; // Default fallback
    }

    const levelKey = userDetails.learned_language + "_cefr_level";
    const levelNumber = userDetails[levelKey];

    // Convert number to letter format
    const levelMap = {
      1: "A1",
      2: "A2",
      3: "B1",
      4: "B2",
      5: "C1",
      6: "C2",
    };

    return levelMap[levelNumber?.toString()] || "B1";
  };

  // Fetch past contexts (articles, videos, etc.)
  const fetchPastContexts = async () => {
    if (!exerciseBookmark?.user_word_id) {
      return;
    }

    const url = `${api.baseAPIurl}/past_contexts/${exerciseBookmark.user_word_id}?session=${api.session}`;

    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        console.error("Failed to fetch past contexts:", response.status);
        return;
      }

      const data = await response.json();

      const contexts = data.past_contexts || [];
      const formattedContexts = contexts
        .filter((ctx) => !ctx.is_preferred)
        .map((ctx) => ({
          id: ctx.bookmark_id,
          sentence: ctx.context,
          translation: ctx.translation || "",
          contextType: ctx.context_type,
          title: ctx.title,
          isFromHistory: true,
        }));

      setPastContexts(formattedContexts);
    } catch (error) {
      console.error("Error fetching past contexts:", error);
    }
  };

  // Fetch AI-generated alternatives
  const fetchAlternatives = async () => {
    if (!exerciseBookmark?.user_word_id) {
      toast.error("Unable to fetch alternatives - missing word ID");
      return;
    }

    setLoading(true);
    const userCEFRLevel = getUserCEFRLevel();
    const url = `${api.baseAPIurl}/alternative_sentences/${exerciseBookmark.user_word_id}?cefr_level=${userCEFRLevel}&session=${api.session}`;

    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      // Examples come with IDs directly from the database
      const formattedExamples = (data.examples || []).map((example) => ({
        ...example,
        isFromHistory: false,
      }));

      setAlternatives(formattedExamples);
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
        toast.error("Network error - check if the API endpoint exists and CORS is configured");
      } else {
        toast.error(`Failed to fetch alternative examples: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchPastContexts(); // Load immediately
    fetchAlternatives(); // Load AI examples (might be slower)
  };

  const handleClose = () => {
    setOpen(false);
    setPastContexts([]);
    setAlternatives([]);
    setSelectedExample(null);
    setLoading(false);
    setSaving(false);
  };

  const handleExampleSelect = async (example) => {
    setSelectedExample(example);
    
    // Automatically save the selection
    setSaving(true);
    
    let url, payload;
    
    if (example.isFromHistory) {
      // Use set_preferred_bookmark for past encounters (bookmarks)
      url = `${api.baseAPIurl}/set_preferred_bookmark/${exerciseBookmark.user_word_id}?session=${api.session}`;
      payload = {
        bookmark_id: example.id,
      };
    } else {
      // Use set_preferred_example for AI-generated examples (example sentences)
      url = `${api.baseAPIurl}/set_preferred_example/${exerciseBookmark.user_word_id}?session=${api.session}`;
      payload = {
        sentence_id: example.id,
      };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          
          if (response.status === 400 && errorData.error === "Unable to save this example") {
            toast.error(errorData.detail || errorData.error);
            console.error("Technical detail:", errorData.technical_detail);
            console.error("User word ID:", errorData.user_word_id);
          } else {
            toast.error(errorData.error || `Failed to save example (${response.status})`);
          }
        } catch (parseError) {
          const errorText = await response.text();
          toast.error(`Failed to save example: ${errorText}`);
        }
        return;
      }

      const data = await response.json();
      toast.success("Example updated successfully!");

      // The backend returns complete updated_bookmark
      onExampleUpdated({
        selectedExample: example,
        updatedBookmark: data.updated_bookmark,
      });

      // Close modal
      handleClose();
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
        toast.error("Network error - check if the save API endpoint exists and CORS is configured");
      } else {
        console.error("Unexpected error saving example:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  // Function to highlight the target word in the sentence
  const highlightTargetWord = (sentence, targetWord) => {
    if (!sentence || !targetWord) return sentence;
    
    // Create a regex that matches the target word (case insensitive, word boundaries)
    const regex = new RegExp(`\\b(${targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
    
    return sentence.split(regex).map((part, index) => {
      // If this part matches the target word (case insensitive), highlight it
      if (part.toLowerCase() === targetWord.toLowerCase()) {
        return <span key={index} style={{color: '#ff8c42', fontWeight: 'bold'}}>{part}</span>;
      }
      return part;
    });
  };

  if (!open) {
    if (renderAs === "button") {
      return (
        <exerciseStyles.StyledGreyButton className="styledGreyButton" onClick={handleOpen}>
          Change preferred example
        </exerciseStyles.StyledGreyButton>
      );
    }

    return <s.TriggerButton onClick={handleOpen}>Change preferred example</s.TriggerButton>;
  }

  return (
    <s.ModalOverlay onClick={handleClose}>
      <s.ModalContent onClick={(e) => e.stopPropagation()}>
        <s.ModalHeader>
          <h3>Select a preferred example</h3>
        </s.ModalHeader>

        <s.ModalBody>
          {loading && (
            <s.LoadingContainer>
              <LoadingAnimation />
              <p>Loading examples...</p>
            </s.LoadingContainer>
          )}

          {(pastContexts.length > 0 || alternatives.length > 0) && (
            <s.ExamplesContainer>
              {/* Past encounters first, then AI alternatives, each group sorted by sentence length */}
              {[
                ...pastContexts.sort((a, b) => a.sentence.length - b.sentence.length),
                ...alternatives.sort((a, b) => a.sentence.length - b.sentence.length)
              ]
                .map((example, index) => (
                  <s.ExampleOption
                    key={example.isFromHistory ? `past-${example.id}` : `alt-${example.id || index}`}
                    selected={selectedExample === example}
                    onClick={() => handleExampleSelect(example)}
                    style={{
                      visibility: selectedExample && selectedExample !== example ? 'hidden' : 'visible'
                    }}
                  >
                    <s.SentenceText>
                      {highlightTargetWord(example.sentence, exerciseBookmark?.from)}
                      {example.isFromHistory && <s.ContextTypeBadge type="past">past encounter</s.ContextTypeBadge>}
                      {saving && selectedExample === example && <span style={{marginLeft: '0.5rem', fontSize: '0.8rem', color: '#666'}}>Saving...</span>}
                    </s.SentenceText>
                    {example.title && <s.ContextTitle>From: {example.title}</s.ContextTitle>}
                  </s.ExampleOption>
                ))}
            </s.ExamplesContainer>
          )}

          {!loading && pastContexts.length === 0 && alternatives.length === 0 && (
            <s.EmptyState>
              <p>No examples available at the moment.</p>
            </s.EmptyState>
          )}
        </s.ModalBody>
      </s.ModalContent>
    </s.ModalOverlay>
  );
}