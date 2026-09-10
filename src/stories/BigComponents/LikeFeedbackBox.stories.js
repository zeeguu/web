import LikeFeedbackBox from "../../reader/LikeFeedbackBox";

export default { title: "BigComponents/LikeFeedbackBox", component: LikeFeedbackBox };

const noop = () => {};

export const Neutral = {
  render: () => <LikeFeedbackBox articleInfo={{ liked: null }} setLikedState={noop} />,
};

export const Liked = {
  render: () => <LikeFeedbackBox articleInfo={{ liked: true }} setLikedState={noop} />,
};

export const Disliked = {
  render: () => <LikeFeedbackBox articleInfo={{ liked: false }} setLikedState={noop} />,
};
