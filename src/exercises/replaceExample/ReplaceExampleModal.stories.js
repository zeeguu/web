import { fn, userEvent, within } from "storybook/test";
import { APIContext } from "../../contexts/APIContext";
import ReplaceExampleModal from "./ReplaceExampleModal";

// The modal calls fetch() itself, so the story answers those endpoints with
// sample data while it is open. Each story picks its data via `fakeApi`.
const FAKE_API = { baseAPIurl: "/fake-api", session: "storybook" };

const PAST_CONTEXTS = [
  { bookmark_id: 11, context: "I want to learn French this year.", title: "New year plans", is_preferred: false },
];
const EXAMPLES = [
  { id: 21, sentence: "Children learn fast." },
  { id: 22, sentence: "We learn from our mistakes every day." },
];

function fakeFetch({ pastContexts, examples }) {
  return async (url) => {
    const json = (body) => new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } });
    if (url.includes("/past_contexts/")) return json({ past_contexts: pastContexts });
    if (url.includes("/alternative_sentences/")) return json({ examples });
    if (url.includes("/set_preferred_")) return json({ updated_bookmark: {} });
    return new Response(null, { status: 404 });
  };
}

async function openModal({ canvasElement }) {
  await userEvent.click(within(canvasElement).getByText("Change example"));
}

export default {
  title: "Dialogs/ReplaceExampleModal",
  component: ReplaceExampleModal,
  args: {
    exerciseBookmark: { user_word_id: 1, from: "learn", to: "apprendre", context: "I learn every day." },
    onExampleUpdated: fn(),
  },
  parameters: { fakeApi: { pastContexts: PAST_CONTEXTS, examples: EXAMPLES } },
  beforeEach: ({ parameters }) => {
    const realFetch = window.fetch;
    window.fetch = fakeFetch(parameters.fakeApi);
    return () => {
      window.fetch = realFetch;
    };
  },
  decorators: [
    (Story) => (
      <APIContext.Provider value={FAKE_API}>
        <Story />
      </APIContext.Provider>
    ),
  ],
};

// Closed: the link shown under an exercise.
export const Link = {};

export const AsButton = { args: { renderAs: "button" } };

export const Open = { play: openModal };

export const NoExamples = {
  parameters: { fakeApi: { pastContexts: [], examples: [] } },
  play: openModal,
};
