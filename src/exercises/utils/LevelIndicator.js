export default function LevelIndicator({ level }) {
  let levelColors = [
    "hsl(43.92 100 80)",
    "hsl(43.92 100 60)",
    "hsl(43.92 100 40)",
    "hsl(43.92 100 40)",
  ];
  console.log(level);

  return (
    <div style={{ marginTop: "-1em", marginBottom: "0.5em" }}>
      {levelColors.map((color, index) => (
        <span
          style={{
            fontSize: "2em",
            fontWeight: "800",
            color: index < level ? color : "lightGray",
          }}
        >
          .
        </span>
      ))}
    </div>
  );
}
