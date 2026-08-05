import { Button } from "../wrappers/Button";

export function Primary() {
  return <Button variant="primary">Book a lesson</Button>;
}

export function Secondary() {
  return <Button variant="secondary">Get a mixing quote</Button>;
}

export function Ghost() {
  return <Button variant="ghost">View all lessons</Button>;
}

export function Disabled() {
  return (
    <Button variant="primary" disabled>
      Redirecting…
    </Button>
  );
}
