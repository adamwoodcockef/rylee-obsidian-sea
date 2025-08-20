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
        <p>Loading applications...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className={styles.Applications}>
        <p>Error: {error}</p>
        <Button className="" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // Empty
  if (!isLoading && applications.length === 0) {
    return (
      <div className={styles.Applications}>
        <p>No applications found.</p>
      </div>
    );
  }

  return (
    <div className={styles.Applications}>
      {applications.map((application) => (
        <SingleApplication key={application.id} application={application} />
      ))}

      {hasMore && (
        <div>
          <Button className="" onClick={fetchNextPage} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load More"}
          </Button>
          {totalCount && (
            <p>
              Showing {applications.length} of {totalCount} applications
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Applications;
