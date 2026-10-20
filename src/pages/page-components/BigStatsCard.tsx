import styled from "@emotion/styled";

type BigStatsCardProps = {
  title: string;
  stat: string | number;
  statNote: string;
  statColor?: string;
};

export const StyledCard = styled("div")({
  border: "1px solid var(--border)",
  borderRadius: 15,
  backgroundColor: "var(--surface-white)",
  display: "grid",
  padding: "1rem",
});

export const StyledCardTitle = styled("div")({
  color: "var(--muted-grey)",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  fontSize: "0.75rem",
});

interface StatProps {
  color?: string;
}
export const StyledBigStatsCardStat = styled("div")<StatProps>(
  ({ color = 'var(--ira-red-color)' }) => ({
    color,
    fontSize: "2rem",
    marginTop: "0.5rem",
    marginBottom: "0.1rem",
    fontWeight: "700",
  })
);

export const StyledBigStatsCardDescription = styled("div")({
  color: "var(--muted-grey)",
  fontSize: "0.75rem",
});

export default function BigStatsCard({
  title,
  stat,
  statNote,
  statColor,
}: BigStatsCardProps) {
  return (
    <StyledCard>
      <StyledCardTitle>{title}</StyledCardTitle>
      <StyledBigStatsCardStat color={statColor}>{stat.toLocaleString()}</StyledBigStatsCardStat>
      <StyledBigStatsCardDescription>{statNote}</StyledBigStatsCardDescription>
    </StyledCard>
  );
}
