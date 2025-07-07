import gql from 'graphql-tag';

export const GET_DAILY_READINGS_FOR_CHURCH = gql`
  query GetDailyReadingsForChurch($churchId: ID!, $date: String!) {
    dailyReadingsForChurch(churchId: $churchId, date: $date) {
      id
      sortOrder
      date
      type
      references
      content
      mediaUrl
      readingPlan {
        id
        name
        description
        planType
        church {
          id
          name
        }
      }
    }
  }
`;

export const GET_TODAYS_READINGS = gql`
  query GetTodaysReadings($churchId: ID!) {
    dailyReadingsForChurch(
      churchId: $churchId, 
      date: "2024-01-15"  # Replace with today's date in YYYY-MM-DD format
    ) {
      id
      sortOrder
      type
      references
      content
      mediaUrl
      readingPlan {
        name
        description
      }
    }
  }
`; 