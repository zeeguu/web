import Chip from "@mui/material/Chip";
import LinkIcon from "@mui/icons-material/Link";
import getDomainName from "../utils/misc/getDomainName";

export default function ArticleSource({ url }) {
  return (
    <div>
      {url && (
        <Chip
          label={getDomainName(url)}
          component="a"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          clickable
          color="primary"
          size="small"
          icon={<LinkIcon />}
        />
      )}
    </div>
  );
}
