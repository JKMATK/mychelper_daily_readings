import gql from 'graphql-tag';

export const GET_CHURCH = gql`
  query GetChurch($id: ID!) {
    church(id: $id) {
      id
      name
      createdAt
      updatedAt
      readingSchedules {
        id
        name
        description
        planType
        entries {
          id
          sortOrder
          date
          type
          references
          content
          mediaUrl
        }
      }
    }
  }
`;

export const GET_ALL_CHURCHES = gql`
  query GetAllChurches {
    churches {
      id
      name
      createdAt
      updatedAt
      readingSchedules {
        id
        name
        description
        planType
      }
    }
  }
`;

export const GET_READING_SCHEDULES_FOR_CHURCH = gql`
  query GetReadingSchedulesForChurch($churchId: ID!) {
    readingSchedulesForChurch(churchId: $churchId) {
      id
      name
      description
      planType
      createdAt
      updatedAt
      church {
        id
        name
      }
      entries {
        id
        sortOrder
        date
        type
        references
        content
        mediaUrl
      }
    }
  }
`; 