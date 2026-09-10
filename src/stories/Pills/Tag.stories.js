import Tag from "../../pages/_pages_shared/Tag.sc";
import TagContainer from "../../pages/_pages_shared/TagContainer.sc";

export default {
  title: "Pills/Tag",
  component: Tag,
  args: {
    children: "Tag",
  },
};

export const Default = {};

export const Small = {
  args: {
    className: "small",
  },
};

export const OutlinedOrange = {
  args: {
    className: "outlined-orange",
  },
};

export const OutlinedBlue = {
  args: {
    className: "outlined-blue",
  },
};

export const Selected = {
  args: {
    className: "selected",
    children: "Selected tag",
  },
};

// TagContainer is the wrapper that arranges multiple tags in a row/wrap layout.
export const MultipleTags = () => (
  <TagContainer>
    <Tag>News</Tag>
    <Tag className="small">tag</Tag>
    <Tag className="outlined-orange">Sport</Tag>
    <Tag className="outlined-blue small">Science</Tag>
    <Tag className="selected">Story</Tag>
  </TagContainer>
);
