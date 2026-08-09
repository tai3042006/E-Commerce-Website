import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext.hooks";

type Review = {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  anonymous: boolean;
  authorName: string;
  createdAt: string;
  isOwn: boolean;
};

type ReviewApiResponse =
  | (Review[] & { error?: undefined })
  | { product: { rating: number; reviews: number }; error?: undefined }
  | { error?: string };

const TOKEN_KEY = "clofit:token";
const getToken  = () => localStorage.getItem(TOKEN_KEY);
const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { "x-auth-token": getToken()! } : {}),
});

/** Safely parse JSON — never throws on empty body or an HTML error page
 *  (e.g. the backend route doesn't exist yet, or the server is down/stale). */
async function safeJson(r: Response): Promise<ReviewApiResponse> {
  const text = await r.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {
      error: r.status === 404
        ? "Reviews API not found — please restart the backend server (it may be running outdated code)."
        : `Server error (${r.status}) — backend may be down or misconfigured.`,
    };
  }
}

const StarPicker = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        const filled = n <= (hover || value);
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} star`}
            className="p-0.5"
          >
            <Star className={`h-6 w-6 transition-colors ${filled ? "text-foreground" : "text-muted-foreground/40"}`}
              fill={filled ? "currentColor" : "none"} strokeWidth={1.5} />
          </button>
        );
      })}
    </div>
  );
};

const StarRow = ({ rating, className = "h-3.5 w-3.5" }: { rating: number; className?: string }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={className}
        fill={i < Math.round(rating) ? "currentColor" : "none"} strokeWidth={1} />
    ))}
  </div>
);

export const ReviewsSection = ({
  productId,
  rating,
  reviewCount,
  onAggregateChange,
}: {
  productId: string;
  rating: number;
  reviewCount: number;
  onAggregateChange?: (agg: { rating: number; reviews: number }) => void;
}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setLoadError(null);
    fetch(`/api/products/${productId}/reviews`, { headers: authHeaders() })
      .then(async r => {
        const data = await safeJson(r);
        if (!r.ok) {
          throw new Error(typeof data.error === "string" ? data.error : "Could not load reviews");
        }
        return data as Review[];
      })
      .then((data: Review[]) => {
        setReviews(data);
        const mine = data.find(r => r.isOwn);
        if (mine) {
          setMyRating(mine.rating);
          setMyComment(mine.comment);
          setAnonymous(mine.anonymous);
        }
      })
      .catch((e: unknown) => {
        setReviews([]);
        setLoadError(e instanceof Error ? e.message : "Could not load reviews");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleSubmit = async () => {
    if (myRating < 1) {
      toast.error("Please choose a star rating.");
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ rating: myRating, comment: myComment, anonymous }),
      });
      const data = await safeJson(r);
      if (!r.ok) throw new Error(typeof data.error === "string" ? data.error : "Could not submit review");
      const { product } = data as { product: { rating: number; reviews: number } };
      toast.success("Thanks for your review!");
      onAggregateChange?.(product);
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete your review?")) return;
    try {
      const r = await fetch(`/api/products/${productId}/reviews/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await safeJson(r);
      if (!r.ok) throw new Error(typeof data.error === "string" ? data.error : "Could not delete review");
      const { product } = data as { product: { rating: number; reviews: number } };
      onAggregateChange?.(product);
      setMyRating(0);
      setMyComment("");
      setAnonymous(false);
      load();
      toast.success("Review deleted.");
    } catch {
      toast.error("Could not delete review.");
    }
  };

  const hasOwn = reviews.some(r => r.isOwn);

  return (
    <div className="mt-16 border-t border-border pt-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold tracking-tight lg:text-2xl">Ratings &amp; Reviews</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <StarRow rating={rating} className="h-4 w-4" />
          <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
          <span>({reviewCount} {reviewCount === 1 ? "review" : "reviews"})</span>
        </div>
      </div>

      {/* Write a review */}
      <div className="mt-6 rounded-2xl border border-border p-5">
        {user ? (
          <>
            <h3 className="text-sm font-semibold">{hasOwn ? "Update your review" : "Write a review"}</h3>
            <div className="mt-3">
              <StarPicker value={myRating} onChange={setMyRating} />
            </div>
            <textarea
              value={myComment}
              onChange={e => setMyComment(e.target.value)}
              rows={3}
              placeholder="Share details about quality, fit, comfort…"
              className="mt-3 w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={e => setAnonymous(e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
                Post anonymously
              </label>
              <div className="flex items-center gap-3">
                {hasOwn && (
                  <button
                    onClick={() => {
                      const mine = reviews.find(r => r.isOwn);
                      if (mine) handleDelete(mine.id);
                    }}
                    className="text-sm font-medium text-red-600 hover:underline"
                  >
                    Delete review
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded-pill bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Saving…" : hasOwn ? "Update review" : "Submit review"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link to="/signin" className="font-semibold text-foreground underline">Sign in</Link> to leave a star rating and review for this product.
          </p>
        )}
      </div>

      {/* Review list */}
      <div className="mt-8 space-y-6">
        {loading && <p className="text-sm text-muted-foreground">Loading reviews…</p>}
        {!loading && loadError && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p>
        )}
        {!loading && !loadError && reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">No reviews yet — be the first to share your thoughts.</p>
        )}
        {!loading && !loadError && reviews.map(r => (
          <div key={r.id} className="border-b border-border pb-6 last:border-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{r.authorName}{r.isOwn ? " (You)" : ""}</p>
                <div className="mt-1 flex items-center gap-2">
                  <StarRow rating={r.rating} />
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {r.isOwn && (
                <button
                  onClick={() => handleDelete(r.id)}
                  aria-label="Delete review"
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            {r.comment && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
