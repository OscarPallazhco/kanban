import { FormEvent } from "react";
import styles from "@/app/page.module.css";

type AddCardFormProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function AddCardForm({ onSubmit, onCancel }: AddCardFormProps) {
  return (
    <form className={styles.addForm} onSubmit={onSubmit}>
      <input name="title" placeholder="Card title" aria-label="Card title" autoFocus required />
      <textarea name="details" placeholder="Details" aria-label="Card details" rows={3} />
      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton}>Add card</button>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
