function Star({ fill, size }) {
  const cls = `leading-none select-none ${size}`;
  if (fill === "full") return <span className={`${cls} text-yellow-400`}>★</span>;
  if (fill === "empty") return <span className={`${cls} text-slate-600`}>★</span>;
  // half star — overlay technique
  return (
    <span className={`${cls} relative inline-block text-slate-600`}>
      ★
      <span
        className="absolute inset-0 overflow-hidden text-yellow-400"
        style={{ width: "50%" }}
      >
        ★
      </span>
    </span>
  );
}

/**
 * Display-only star rating with half-star support.
 * @param {number} rating   – e.g. 4.3, 3.5
 * @param {"xs"|"sm"|"md"|"lg"} size
 * @param {boolean} showNumber  – show the numeric value beside stars
 */
export default function StarRating({ rating = 5, size = "sm", showNumber = true }) {
  const sizeMap = { xs: "text-xs", sm: "text-sm", md: "text-lg", lg: "text-2xl" };
  const textSize = sizeMap[size] || sizeMap.sm;

  const fills = [1, 2, 3, 4, 5].map((i) => {
    if (rating >= i) return "full";
    if (rating >= i - 0.5) return "half";
    return "empty";
  });

  return (
    <span className={`inline-flex items-center gap-px ${textSize}`}>
      {fills.map((fill, i) => (
        <Star key={i} fill={fill} size={textSize} />
      ))}
      {showNumber && (
        <span className="text-xs text-slate-400 ml-1">{Number(rating).toFixed(1)}</span>
      )}
    </span>
  );
}
