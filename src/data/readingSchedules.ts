export const readingSchedules = [
  {
    name: "Advent 2024",
    description: "Daily readings for the Advent season leading to Christmas",
    planType: "liturgical" as const,
  },
  {
    name: "Lent 2024",
    description: "Daily readings for the Lenten season",
    planType: "liturgical" as const,
  },
  {
    name: "Easter 2024",
    description: "Daily readings for the Easter season",
    planType: "liturgical" as const,
  },
  {
    name: "Daily Devotions 2024",
    description: "Custom daily devotional readings",
    planType: "custom" as const,
  },
  {
    name: "Bible Study 2024",
    description: "Systematic Bible study readings",
    planType: "custom" as const,
  }
]; 