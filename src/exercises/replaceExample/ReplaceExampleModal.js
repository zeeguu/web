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

  // Fetch alternatives when modal opens
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

      // Examples now come with IDs directly from the database
      setAlternatives(data.examples || []);
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

  // Save selected example
  const saveSelectedExample = async () => {
    if (!selectedExample || !exerciseBookmark?.user_word_id) {
      return;
    }

    setSaving(true);
    const url = `${api.baseAPIurl}/set_preferred_example/${exerciseBookmark.user_word_id}?session=${api.session}`;
    const payload = {
      sentence_id: selectedExample.id, // New API only needs the sentence ID
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      toast.success("Example updated successfully!");

      // The backend now returns complete updated_bookmark with context_tokenized
      onExampleUpdated({
        selectedExample,
        updatedBookmark: data.updated_bookmark,
      });

      // Close modal
      handleClose();
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
        toast.error("Network error - check if the save API endpoint exists and CORS is configured");
      } else {
        toast.error(`Failed to save selected example: ${error.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchAlternatives();
  };

  const handleClose = () => {
    setOpen(false);
    setAlternatives([]);
    setSelectedExample(null);
    setLoading(false);
    setSaving(false);
  };

  const handleExampleSelect = (example) => {
    setSelectedExample(example);
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
          Replace sentence
        </exerciseStyles.StyledGreyButton>
      );
    }

    return <s.TriggerButton onClick={handleOpen}>Try different example</s.TriggerButton>;
  }

  return (
    <s.ModalOverlay onClick={handleClose}>
      <s.ModalContent onClick={(e) => e.stopPropagation()}>
        <s.ModalHeader>
          <h3>
            Select new example sentence
          </h3>
        </s.ModalHeader>

        <s.ModalBody>
          {loading && (
            <s.LoadingContainer>
              <LoadingAnimation />
              <p>Generating alternative examples...</p>
            </s.LoadingContainer>
          )}

          {!loading && alternatives.length > 0 && (
            <s.ExamplesContainer>
              {alternatives.map((example, index) => (
                <s.ExampleOption
                  key={index}
                  selected={selectedExample === example}
                  onClick={() => handleExampleSelect(example)}
                >
                  <s.SentenceText>
                    {highlightTargetWord(example.sentence, exerciseBookmark?.from)}
                  </s.SentenceText>
                  <s.TranslationText>{example.translation}</s.TranslationText>
                </s.ExampleOption>
              ))}
            </s.ExamplesContainer>
          )}

          {!loading && alternatives.length === 0 && (
            <s.EmptyState>
              <p>No alternative examples available at the moment.</p>
            </s.EmptyState>
          )}
        </s.ModalBody>

        <s.ModalFooter>
          <s.CancelButton onClick={handleClose}>Cancel</s.CancelButton>
          <s.SaveButton onClick={saveSelectedExample} disabled={!selectedExample || saving}>
            {saving ? "Saving..." : "Use This Example"}
          </s.SaveButton>
        </s.ModalFooter>
      </s.ModalContent>
    </s.ModalOverlay>
  );
}
