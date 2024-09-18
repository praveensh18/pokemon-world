import { useMutationState, useQuery } from '@tanstack/react-query';
import { PokemonAPI } from '../../../api/pokemon-api';
import {
  Alert,
  AlertIcon,
  List,
  ListItem,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

const ReviewList = ({ pokemonId }) => {
  const listRef = useRef();
  const {
    data: reviews = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ['reviews', 'pokemonId -' + pokemonId],
    queryFn: () => PokemonAPI.fetchReviewsByPokemon(pokemonId),
  });

  const optimisticReviewContent = useMutationState({
    filters: {
      mutationKey: ['addReview'],
      status: 'pending',
    },
    select: (mutation) => mutation.state.variables,
  });

  useEffect(() => {
    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [optimisticReviewContent.length]);

  if (error) {
    return (
      <Alert>
        <AlertIcon />
        Error Loading Reviews
      </Alert>
    );
  }

  return (
    <List spacing={3} h={300} w={400} overflowY={'auto'} ref={listRef}>
      {isLoading ? (
        [...Array(5)].map((_, i) => (
          <ListItem key={'skeleton' + i}>
            <Skeleton height={'71px'} />
          </ListItem>
        ))
      ) : reviews?.length === 0 ? (
        <Text>No reviews found. Be the first to create one!</Text>
      ) : (
        reviews.map((review) => (
          <ListItem key={review.id} p={3} shadow={'md'} borderWidth={'1px'}>
            {review.content}
            <Text fontSize={'sm'} color={'gray.500'}>
              {review.author}
            </Text>
          </ListItem>
        ))
      )}
      {optimisticReviewContent.length > 0 && (
        <ListItem opacity={0.5} p={3} shadow={'md'} borderWidth={'1px'}>
          {optimisticReviewContent[0]}
          <Text fontSize={'sm'} color={'gray.500'}>
            Me
          </Text>
        </ListItem>
      )}
    </List>
  );
};

export default ReviewList;
