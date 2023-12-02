import Chip from '@mui/material/Chip';
import LinkIcon from '@mui/icons-material/Link';

export default function ArticleSource({ url }) {
  return (
    <div style={{ marginLeft: '5px', marginRight: '5px' }}>
      {url && (
        <Chip
        label="Source"
        component="a"
        href={url}
        variant="outlined"
        clickable
        color="primary"
        size="small"
        icon={<LinkIcon />}
      />)}
    </div>
  );
}
