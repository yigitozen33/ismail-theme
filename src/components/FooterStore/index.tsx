import { useEffect, useState } from "preact/hooks";
import { isOpenNow } from "../../utils/storeHours";
import { Props } from "./types";

/**
 * I/Section/Footer › footer-store — one store line of the footer's bottom-row status. It only marks
 * whether it is open now (data-open, Istanbul time, re-checked every minute; no hours = always open);
 * the Footer stacks the open ones and slides between them.
 */
export function FooterStore({ name = "KADIKÖY MAĞAZASI 21:00'E KADAR", hours = "10:00–21:00" }: Props) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const check = () => setOpen(isOpenNow(hours) ?? true);
    check();
    const timer = setInterval(check, 60_000);
    return () => clearInterval(timer);
  }, [hours]);
  if (!name) return null;
  return (
    <span className="fstore" data-open={open ? "1" : "0"}>
      {name}
    </span>
  );
}

export default FooterStore;
