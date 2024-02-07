import { AppBar, Box, Container, Dialog, IconButton, Rating, Slide, Stack, Toolbar, Typography } from '@mui/material'
import { useValue } from '../../context/ContextProvider'
import { forwardRef, useEffect, useState } from 'react';
import { Close, StarBorder } from '@mui/icons-material';
import Gears from './Gears';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import mapboxgl from 'mapbox-gl';

const Transition = forwardRef((props, ref)=>{
    return <Slide direction='up'{...props} ref={ref}/>
})

const GearPage = () => {
    const {state:{gear}, dispatch} = useValue();
    const [place, setPlace] = useState(null);
    const [map, setMap] = useState(null);

    useEffect(()=>{
        if(gear){
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${gear.lng},${gear.lat}.json?access_token=${process.env.REACT_APP_MAP_TOKEN}`;
            fetch(url)
                .then(response => response.json())
                .then((data) => {
                    setPlace(data.features[0]);
                    initializeMap(data.features[0].center);
                });
        }
    },[gear])

    const handleClose = ()=>{
        dispatch({type:'UPDATE_GEAR', payload: null})
    }

    const initializeMap = (center) => {
        mapboxgl.accessToken = process.env.REACT_APP_MAP_TOKEN;
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: center,
            zoom: 12
        });
        new mapboxgl.Marker()
            .setLngLat(center)
            .addTo(map);
        setMap(map);
    }

    return (
        <Dialog
            fullScreen
            open={Boolean(gear)}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar position='relative'>
                <Toolbar>
                    <Typography
                        variant='h6'
                        component='h3'
                        sx={{
                            ml:2,
                            flex:1
                        }}
                    >
                        {gear?.title}
                    </Typography>
                    <IconButton
                        color='inherit'
                        onClick={handleClose}
                    >
                        <Close/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container sx={{pt:5}}>
                <Stack sx={{p:3}} spacing={2}>
                    <Box>
                        <Carousel showArrows={true} showThumbs={true}>
                            {gear?.images?.map((url, index) => (
                                <div key={index}>
                                    <img src={url} alt={`image-${index}`} style={{ maxWidth: '60%', height: 'auto' }} />
                                </div>
                            ))}
                        </Carousel>
                    </Box>
                    <Stack direction="row" sx={{justifyContent:'space-between',flexWrap:'wrap'}}>
                        <Box>
                            <Typography variant='h6' component='span'>{'Price per day: '}</Typography>
                            <Typography component='span' >{gear?.price === 0 ? 'Free rental': '€'+gear?.price}</Typography>
                        </Box>
                        <Box sx={{display:'flex',alignItems: 'center'}}>
                            <Typography variant='h6' component='span'>{'Rating: '}</Typography>
                            <Rating
                                name='gear-rating'
                                defaultValue={4}
                                precision={0.5}
                                emptyIcon={<StarBorder/>}
                            />
                        </Box>
                    </Stack>
                    <Stack direction="row" sx={{justifyContent:'space-between',flexWrap:'wrap'}}>
                        <Box>
                            <Typography variant='h6' component='span'>{'Location: '}</Typography>
                            <Typography component='span' > {place?.text}</Typography>
                        </Box>
                    </Stack>
                    <Stack>
                        <Typography variant='h6' component='span'>{'Description: '}</Typography>
                        <Typography component='span' > {gear?.description}</Typography>
                    </Stack>
                    <Stack direction="row" sx={{justifyContent:'space-between',flexWrap:'wrap'}}>
                    <Box sx={{display:'flex-column',alignItems: 'center'}}>
                            <Typography variant='h6' component='span'>{'Address: '}</Typography>
                            <Typography component='span' > {place?.place_name}</Typography>
                    </Box>
                    </Stack>
                    <Box id="map" style={{ width: '100%', height: '300px' }} />
                </Stack>
            </Container>
        </Dialog>
    )
}

export default GearPage;
