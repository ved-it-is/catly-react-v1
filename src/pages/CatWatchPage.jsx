import { useMemo, useState } from "react";
import {
  Clock3,
  Play,
  Search,
  SlidersHorizontal,
  X,
  Youtube,
} from "lucide-react";

import {
  CAT_WATCH_CATEGORIES,
  CAT_WATCH_VIDEOS,
} from "../data/catWatchVideos";

function getThumbnail(video) {
  if (video.thumbnailUrl) return video.thumbnailUrl;

  if (video.youtubeId) {
    return `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
  }

  return null;
}

function matchesVideo(video, query, category) {
  const searchText = [
    video.title,
    video.channel,
    video.category,
    video.tags,
  ]
    .flat()
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    (category === "All" || video.category === category) &&
    searchText.includes(query.toLowerCase())
  );
}

export default function CatWatchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [activeVideo, setActiveVideo] = useState(null);

  const videos = useMemo(() => {
    return CAT_WATCH_VIDEOS.filter((video) =>
      matchesVideo(video, query, category)
    );
  }, [query, category]);

  const featuredVideo = CAT_WATCH_VIDEOS.find(
    (video) => video.featured
  );

  return (
    <section
      className="cat-watch-page"
      aria-labelledby="cat-watch-title"
    >
      <div className="cat-watch-heading">
        <div>
          <div className="eyebrow cat-watch-eyebrow">
            <Youtube size={15} />
            CATLY VIDEO LIBRARY
          </div>

          <h1 id="cat-watch-title">CAT Watch</h1>

          <p>
            Curated lessons, strategy and guidance for every
            stage of your CAT preparation.
          </p>
        </div>

        <div className="cat-watch-count">
          {CAT_WATCH_VIDEOS.length} curated videos
        </div>
      </div>

      <div className="cat-watch-featured">
        {featuredVideo ? (
          <button
            className="featured-thumbnail"
            onClick={() => setActiveVideo(featuredVideo)}
            aria-label={`Play ${featuredVideo.title}`}
          >
            <img
              src={getThumbnail(featuredVideo)}
              alt=""
            />

            <span className="featured-play">
              <Play size={23} fill="currentColor" />
            </span>
          </button>
        ) : (
          <div className="featured-thumbnail featured-placeholder">
            <div className="featured-play">
              <Play size={23} fill="currentColor" />
            </div>
          </div>
        )}

        <div className="featured-copy">
          <div className="featured-label">
            Featured this week
          </div>

          {featuredVideo ? (
            <>
              <h2>{featuredVideo.title}</h2>

              <p>{featuredVideo.description}</p>

              <div className="video-meta">
                <span>{featuredVideo.channel}</span>
                <span>{featuredVideo.duration}</span>
              </div>

              <button
                className="watch-now"
                onClick={() => setActiveVideo(featuredVideo)}
              >
                Watch now
                <Play size={15} fill="currentColor" />
              </button>
            </>
          ) : (
            <>
              <h2>
                Your next great CAT lesson belongs here.
              </h2>

              <p>
                Add one verified video to the curated catalogue
                and mark it <code>featured: true</code>.
              </p>

              <span className="watch-now disabled">
                Featured video coming soon
                <Play size={15} />
              </span>
            </>
          )}
        </div>
      </div>

      <div className="cat-watch-controls">
        <label className="video-search">
          <Search size={19} />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search topics, channels or lessons"
            aria-label="Search CAT videos"
          />
        </label>

        <div
          className="category-row"
          aria-label="Video categories"
        >
          <SlidersHorizontal size={17} />

          {CAT_WATCH_CATEGORIES.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="cat-watch-grid-heading">
        <div>
          <h2>Explore CAT Watch</h2>

          <p>
            {videos.length
              ? `${videos.length} videos matched`
              : "A deliberately curated, CAT-only library."}
          </p>
        </div>
      </div>

      {videos.length ? (
        <div className="video-grid">
          {videos.map((video) => (
            <button
              className="video-card"
              key={video.id}
              onClick={() => setActiveVideo(video)}
              aria-label={`Play ${video.title}`}
            >
              <div className="video-thumbnail">
                <img
                  src={getThumbnail(video)}
                  alt=""
                  loading="lazy"
                />

                <span className="video-duration">
                  <Clock3 size={13} />
                  {video.duration}
                </span>

                <span className="video-card-play">
                  <Play size={18} fill="currentColor" />
                </span>
              </div>

              <div className="video-card-body">
                <span className="video-category">
                  {video.category}
                </span>

                <h3>{video.title}</h3>

                <p>{video.channel}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="video-empty">
          <Youtube size={27} />

          <h3>No videos match that search.</h3>

          <p>Try a different topic or category.</p>
        </div>
      )}

      {activeVideo && (
        <div
          className="video-modal-backdrop"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="video-modal"
            role="dialog"
            aria-modal="true"
            aria-label={activeVideo.title}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="video-modal-close"
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
            >
              <X size={20} />
            </button>

            <div className="video-player">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="video-modal-info">
              <span>{activeVideo.category}</span>
              <h2>{activeVideo.title}</h2>
              <p>{activeVideo.channel}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}