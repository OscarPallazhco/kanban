import styles from "@/app/page.module.css";

type BoardHeaderProps = {
  cardCount: number;
};

export function BoardHeader({ cardCount }: BoardHeaderProps) {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.brandMark} aria-hidden="true">K</div>
        <div>
          <p className={styles.eyebrow}>Workspace / Product Studio</p>
          <h1>Good work, in motion.</h1>
        </div>
        <div className={styles.headerMeta}>
          <span className={styles.liveDot} />
          {cardCount} active cards
        </div>
      </header>
      <section className={styles.boardHeader}>
        <div>
          <p className={styles.kicker}>Sprint board</p>
          <h2>Launch week</h2>
          <p className={styles.subtitle}>A quiet place to make the next right thing visible.</p>
        </div>
        <div className={styles.boardStats}>
          <span>5 stages</span>
          <span className={styles.statDivider} />
          <span>Updated just now</span>
        </div>
      </section>
    </>
  );
}
