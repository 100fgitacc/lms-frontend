export default function GetAvgRating(ratingArr) {
  if (!ratingArr?.length) return 0;
  const totalReviewCount = ratingArr.reduce((acc, curr) => {
    acc += Number(curr.rating);
    return acc;
  }, 0);

  const multiplier = Math.pow(10, 1);
  const avgReviewCount =
    Math.round((totalReviewCount / ratingArr.length) * multiplier) / multiplier;

  return avgReviewCount;
}
