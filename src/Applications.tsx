import SingleApplication from "./SingleApplication";
import styles from "./Applications.module.css";
import { useApi } from "./api/useApi";
import { Button } from "./ui/Button/Button";

const Applications = () => {
  const { applications, isLoading, error, hasMore, fetchNextPage, totalCount } =
    useApi();

  // Loading
  if (isLoading && applications.length === 0) {
    return (
      <div className={styles.Applications}>
        <div className={styles.loadingState}>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className={styles.Applications}>
        <div className={styles.errorState}>
          <p>Error: {error}</p>
          <Button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Empty
  if (!isLoading && applications.length === 0) {
    return (
      <div className={styles.Applications}>
        <div className={styles.emptyState}>
          <p>No applications found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Applications}>
      {applications.map((application) => (
        <SingleApplication key={application.id} application={application} />
      ))}

      {hasMore && (
        <div className={styles.loadMoreSection}>
          <Button
            className={styles.loadMoreButton}
            onClick={fetchNextPage}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
          {totalCount && (
            <p className={styles.paginationInfo}>
              Showing {applications.length} of {totalCount} applications
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Applications;
