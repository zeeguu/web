import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FlightIcon from "@mui/icons-material/Flight";
import PaletteIcon from "@mui/icons-material/Palette";
import ScienceIcon from "@mui/icons-material/Science";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";

// Vague, neutral glyphs for the backend's fixed topic set (the `topic`
// table: 8 rows). Used as a thumbnail stand-in when an article has no
// image so image-less rows still read as deliberate cards rather than
// collapsed text. Keyed by the exact titles stored in the DB.
const TOPIC_ICONS = {
  Sports: SportsSoccerIcon,
  "Culture & Art": PaletteIcon,
  "Technology & Science": ScienceIcon,
  "Travel & Tourism": FlightIcon,
  "Health & Society": FavoriteBorderIcon,
  Business: BusinessCenterIcon,
  Politics: AccountBalanceIcon,
  Satire: TheaterComedyIcon,
};

// `topicsList` is article.topics_list: an array of [title, origin] tuples
// (see Article.topics_as_tuple in the API). Returns the icon component for
// the first recognized topic, falling back to a generic article glyph when
// there are no topics or none are recognized.
export function topicIconFor(topicsList) {
  if (Array.isArray(topicsList)) {
    for (const entry of topicsList) {
      const title = Array.isArray(entry) ? entry[0] : entry;
      if (TOPIC_ICONS[title]) return TOPIC_ICONS[title];
    }
  }
  return ArticleOutlinedIcon;
}
