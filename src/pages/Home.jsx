import {
  List,
  ListItem,
  Container,
  Image,
  Button,
  HStack,
  Skeleton,
  Center,
  Box,
  Text,
} from '@chakra-ui/react';
import { PokemonAPI } from '../api/pokemon-api';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../router';
import { useState } from 'react';

const POKEMON_IMAGE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const PER_PAGE = 5;
const MAX_PAGE = 20;

const Home = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const {
    data: pokemonList = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ['pokemons', 'page-' + page],
    queryFn: () => PokemonAPI.fetchPokemons(page, PER_PAGE),
    staleTime: Infinity,
  });

  const loadNextPage = () => {
    if (page < MAX_PAGE) {
      setPage((oldPage) => oldPage + 1);
    }
  };

  const loadPreviousPage = () => {
    if (page > 1) {
      setPage((oldPage) => oldPage - 1);
    }
  };

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Box>
    <Text display={'flex'} justifyContent={'center'} fontSize={'xx-large'} mt={8} fontWeight={'bold'}>Catch your favourite Pokemon</Text>
    <Container mt={10}>
      
      <List spacing={3}>
        {pokemonList.map((pokemon) => (
          <ListItem
            onClick={() => navigate(ROUTES.detail + '/' + pokemon.id)}
            key={pokemon.id}
            p={2}
            borderWidth={'1px'}
            borderRadius={'md'}
            display={'flex'}
            alignItems={'center'}
            cursor={'pointer'}
            borderColor={'#000'}
          >
            <Image
              boxSize={'60px'}
              src={`${POKEMON_IMAGE_URL}/${pokemon.id}.png`}
              alt='pokemon image'
            />
            {pokemon.name}
          </ListItem>
        ))}
        {isLoading &&
          Array.from({ length: PER_PAGE }).map((_, i) => (
            <ListItem key={'skeleton' + i}>
              <Skeleton height={'78px'} backgroundColor={'red'}/>
            </ListItem>
          ))}
      </List>
      <HStack spacing={4} display={'flex'} justifyContent={'center'} mt={10}>
        <Button isDisabled={page === 1} onClick={loadPreviousPage}>
          Load Previous
        </Button>
        <Button isDisabled={page === MAX_PAGE} onClick={loadNextPage}>
          Load Next
        </Button>
      </HStack>
      <Center mt={10}>
        {Array.from({ length: MAX_PAGE }).map((_, i) => (
          <Button
            variant={page == i + 1 ? 'solid' : 'link'}
            key={'pageBtn' + i}
            color={'#000'}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </Center>
    </Container>
    </Box>
  );
};

export default Home;
