import * as s from "./CompactWord.sc";

export default function CompactWord({ bookmark }) {
  const hasRank = bookmark.origin_rank && bookmark.origin_rank !== "";
  
  return (
    <s.CompactWord>
      <s.WordContent>
        <span className="from">{bookmark.from}</span>
        {hasRank && (
          <sup className="rank">{bookmark.origin_rank}</sup>
        )}
        <span className="separator">-</span>
        <span className="to">{bookmark.to}</span>
        {bookmark.is_user_added && (
          <span className="user-added" title="User added word">
            manually added
          </span>
        )}
      </s.WordContent>
    </s.CompactWord>
  );
}