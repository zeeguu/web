// completely the work of Claude

import { useState, useContext } from "react";
import { APIContext } from "../../contexts/APIContext";
import * as s from "./ReplaceExampleModal.sc";
import * as exerciseStyles from "../exerciseTypes/Exercise.sc";
import { BlueButton } from "../exerciseTypes/Exercise.sc";
import LoadingAnimation from "../../components/LoadingAnimation";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

export default function ReplaceExampleModal({
  exerciseBookmark,
  onExampleUpdated,
  renderAs = "link", // "link" or "button"
  label = "Change example", // customizable label
}) {
  const api = useContext(APIContext);
  const [open, setOpen] = useState(false);
  const [pastContexts, setPastContexts] = useState([]);
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExample, setSelectedExample] = useState(null);
  const [saving, setSaving] = useState(false);

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
        console.warn("Past contexts endpoint not available:", response.status);
        return;
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("Past contexts endpoint returned non-JSON response");
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
      console.warn("Past contexts feature not available:", error.message);
    }
  };

  // Fetch AI-generated alternatives
  const fetchAlternatives = async () => {
    if (!exerciseBookmark?.user_word_id) {
      toast.error("Unable to fetch alternatives - missing word ID");
      return;
    }

    setLoading(true);
    const url = `${api.baseAPIurl}/alternative_sentences/${exerciseBookmark.user_word_id}?session=${api.session}`;

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
      const formattedExamples = (data.examples || [])
        .filter((example) => example.sentence !== exerciseBookmark?.context)
        .map((example) => ({
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
    const regex = new RegExp(`\\b(${targetWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "gi");

    return sentence.split(regex).map((part, index) => {
      // If this part matches the target word (case insensitive), highlight it
      if (part.toLowerCase() === targetWord.toLowerCase()) {
        return (
          <span key={index} style={{ color: "#ff8c42", fontWeight: "bold" }}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  if (!open) {
    if (renderAs === "button") {
      return <BlueButton onClick={handleOpen}>{label}</BlueButton>;
    }

    if (renderAs === "link") {
      return (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleOpen();
          }}
          style={{
            color: "#666",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "inherit",
          }}
        >
          {label}
        </a>
      );
    }

    return <exerciseStyles.StyledGreyButton onClick={handleOpen}>{label}</exerciseStyles.StyledGreyButton>;
  }

  return (
    <s.ModalOverlay onClick={handleClose}>
      <s.ModalContent onClick={(e) => e.stopPropagation()}>
        <s.ModalHeader>
          <h3>
            Select example for <span style={{ color: "orange" }}>{exerciseBookmark?.from}</span> /{" "}
            <span style={{ color: "darkblue" }}>{exerciseBookmark?.to}</span>
          </h3>
          <s.CloseButton onClick={handleClose}>
            <CloseIcon />
          </s.CloseButton>
        </s.ModalHeader>

        <s.ModalBody>
          <s.ExamplesContainer>
            {/* Past encounters first */}
            {pastContexts.length > 0 &&
              pastContexts
                .sort((a, b) => a.sentence.length - b.sentence.length)
                .map((example, index) => (
                  <s.ExampleOption
                    key={`past-${example.id}`}
                    selected={selectedExample === example}
                    onClick={() => handleExampleSelect(example)}
                    style={{
                      visibility: selectedExample && selectedExample !== example ? "hidden" : "visible",
                    }}
                  >
                    <s.SentenceText>
                      {highlightTargetWord(example.sentence, exerciseBookmark?.from)}
                      {saving && selectedExample === example && (
                        <span style={{ marginLeft: "0.5rem", fontSize: "0.8rem", color: "#666" }}>Saving...</span>
                      )}
                    </s.SentenceText>
                    {example.title && (
                      <s.ContextTitle>
                        From: {example.title}
                        <s.ContextTypeBadge type="past">past encounter</s.ContextTypeBadge>
                      </s.ContextTitle>
                    )}
                  </s.ExampleOption>
                ))}

            {/* Loading spinner for AI examples */}
            {loading && (
              <s.LoadingContainer>
                <LoadingAnimation />
                <p>Loading AI suggestions...</p>
              </s.LoadingContainer>
            )}

            {/* AI alternatives after loading */}
            {!loading &&
              alternatives.length > 0 &&
              alternatives
                .sort((a, b) => a.sentence.length - b.sentence.length)
                .map((example, index) => (
                  <s.ExampleOption
                    key={`alt-${example.id || index}`}
                    selected={selectedExample === example}
                    onClick={() => handleExampleSelect(example)}
                    style={{
                      visibility: selectedExample && selectedExample !== example ? "hidden" : "visible",
                    }}
                  >
                    <s.SentenceText>
                      {highlightTargetWord(example.sentence, exerciseBookmark?.from)}
                      {saving && selectedExample === example && (
                        <span style={{ marginLeft: "0.5rem", fontSize: "0.8rem", color: "#666" }}>Saving...</span>
                      )}
                    </s.SentenceText>
                    {example.title && <s.ContextTitle>From: {example.title}</s.ContextTitle>}
                  </s.ExampleOption>
                ))}
          </s.ExamplesContainer>

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
