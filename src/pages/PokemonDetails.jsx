import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { PokemonAPI } from '../api/pokemon-api';
import {
  Box,
  Center,
  Heading,
  Image,
  Spinner,
  Text,
  Flex,
  Input,
} from '@chakra-ui/react';
import ReviewList from '../features/Reviews/ReviewList/ReviewList';

const POKEMON_IMAGE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

const PokemonDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    data: pokemon,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => PokemonAPI.fetchPokemon(id),
    staleTime: 15000,
  });

  const { mutate: addNewReview } = useMutation({
    mutationKey: ['addReview'],
    mutationFn: (content) => PokemonAPI.addReview(id, content),
    onSettled: (reviewResponse) =>
      // queryClient.invalidateQueries({
      //   queryKey: ['reviews', 'pokemonId -' + id],
      // }),
      queryClient.setQueryData(
        ['reviews', 'pokemonId -' + id],
        (oldReviewList) => [...oldReviewList, reviewResponse]
      ),
  });

  if (isLoading) {
    return (
      <Center h={'100vh'}>
        <Spinner size={'xl'} />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h={'100vh'}>
        <Text color={'red.500'}>{error.message}</Text>
      </Center>
    );
  }

  return (
    <Flex flexDirection={'column'} alignItems={'center'}>
      <Flex w={'100%'} justifyContent={'center'} mt={5}>
        <Flex
          p={5}
          w={400}
          bg={'gray.50'}
          borderRadius={'md'}
          boxShadow={'lg'}
          flexDirection={'column'}
          alignItems={'center'}
        >
          <Heading mb={4}>{pokemon.name}</Heading>
          <Box>
            <Image src={`${POKEMON_IMAGE_URL}/${id}.png`} alt='pokemon image' />
          </Box>
          <Flex flexDirection={'column'} gap={3}>
            <Box fontSize={'lg'} textAlign={'center'}>
              <strong>Type:</strong>
              <Text>{pokemon.types.join(', ')}</Text>
            </Box>
            <Box fontSize={'lg'} textAlign={'center'}>
              <strong>Abilities:</strong>
              <Text>{pokemon.moves.map((move) => move.name).join(', ')}</Text>
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <Box mt={5}>
        <ReviewList pokemonId={id}></ReviewList>
      </Box>
      <Input
        type='text'
        borderColor={'#005da7'}
        placeholder='Add a review'
        w={400}
        mt={10}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addNewReview(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </Flex>
  );
};

export default PokemonDetails;
