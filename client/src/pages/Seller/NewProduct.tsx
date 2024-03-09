import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import {
  useRef,
  useState,
  ChangeEvent,
  FormEvent,
  useContext,
  forwardRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { PartialProduct } from '../../types/product';
import { useNavigate } from 'react-router-dom';
import { uploadProductWithPictures } from '../../utils/db';
import { FirebaseAuthContext } from '../../contexts/currentAuthUserContext';

const availableTypes: string[] = [
  'Pintura',
  'Escultura',
  'Fotografia',
  'Desenho',
  'Colagens',
  'Impressões e Gravuras',
  'Arte Digital',
  'Instalação',
  'Design',
  'Arte Têxtil',
];

type CustomProps = {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
};

const PriceInput = forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        allowNegative={false}
        allowedDecimalSeparators={[',']}
        decimalScale={2}
        decimalSeparator=","
        fixedDecimalScale={true}
        thousandsGroupStyle="thousand"
        thousandSeparator="."
        valueIsNumericString
        suffix="€"
      />
    );
  }
);

const DimensionInput = forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        allowNegative={false}
        allowedDecimalSeparators={[',']}
        decimalScale={2}
        decimalSeparator=","
        valueIsNumericString
      />
    );
  }
);

const MAX_IMAGES = 12;

const NewProduct = () => {
  const { t } = useTranslation();
  const { user } = useContext(FirebaseAuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState<string>('');
  const [description, setDescription] = useState('');
  const [technique, setTechnique] = useState<string>('');
  const [materials, setMaterials] = useState<string[]>([]);
  const [materialsInput, setMaterialsInput] = useState<string>('');
  const [maskedValues, setMaskedValues] = useState({
    price: '',
    width: '',
    height: '',
    depth: '',
    weight: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [noPhotosError, setNoPhotosError] = useState<boolean>(false);

  const imageUrls = images.map((file) => URL.createObjectURL(file));

  if (user.role !== 'seller') {
    return;
  }

  const onAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    console.log(fileList);
    if (fileList) {
      const files = [...images, ...fileList];
      setImages(files.slice(0, MAX_IMAGES));
    }
  };

  const onDeleteImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const addNewImageButtonClick = () => {
    inputRef.current.click();
  };

  const handleMaskedValuesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMaskedValues({
      ...maskedValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMaterialsInput('');
    if (images.length === 0) {
      setNoPhotosError(true);
      setTimeout(() => {
        setNoPhotosError(false);
      }, 3000);
      return;
    }

    const product: PartialProduct = {
      title: title,
      description: description,
      price: parseFloat(maskedValues.price),
      product_type: 'piece',
      piece_info: {
        technique: technique,
        materials: materials,
        dimensions: {
          width: parseFloat(maskedValues.width),
          height: parseFloat(maskedValues.height),
          depth: parseFloat(maskedValues.depth),
          weight: parseFloat(maskedValues.weight),
        },
        year: 2024,
        state: 'STATE',
      },
      author: author,
    };

    try {
      const savedProductId = await uploadProductWithPictures(
        user,
        product,
        images
      );
      navigate(`/product/${savedProductId}`);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          handleFormSubmit(e);
        }}
        sx={{
          paddingY: '2rem',
          paddingX: {
            xs: '2rem',
            sm: '4rem',
            md: '6rem',
            lg: '20%',
          },
        }}>
        {' '}
        <Stack
          direction="column"
          spacing={4}
          alignItems={'center'}
          justifyContent={'flex-start'}>
          <Typography variant="h3">
            {t('artist.new-piece')}
          </Typography>
          <Paper
            sx={{
              width: '100%',
              padding: '2rem',
            }}>
            <Typography variant="h4">
              {t('artist.new-piece-page.paper-basic-info')}
            </Typography>
            <TextField
              variant="standard"
              margin="normal"
              label={t('global.title')}
              type="text"
              fullWidth
              error={false}
              helperText={''}
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              variant="standard"
              margin="normal"
              label={t('global.author')}
              type="text"
              fullWidth
              error={false}
              helperText={''}
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <TextField
              variant="standard"
              margin="normal"
              label={t('global.description')}
              type="text"
              fullWidth
              multiline
              error={false}
              helperText={''}
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={{ xs: 2, sm: 4 }}
              sx={{ marginTop: '1rem' }}
              alignItems={'center'}>
              <TextField
                fullWidth
                label={t('global.price')}
                value={maskedValues.price}
                onChange={handleMaskedValuesChange}
                name="price"
                id="formatted-price-input"
                InputProps={{
                  inputComponent: PriceInput as any,
                }}
                variant="standard"
              />
              <FormControl
                variant="standard"
                sx={{
                  m: 1,
                  minWidth: 120,
                  margin: '0',
                }}
                fullWidth>
                <InputLabel id="select-type-label">
                  {t('product.technique')}
                </InputLabel>
                <Select
                  labelId="select-type-label"
                  id="demo-simple-select-standard"
                  value={technique}
                  onChange={(e) =>
                    setTechnique(e.target.value)
                  }
                  label={t('global.types')}>
                  {availableTypes.map((tp, index) => (
                    <MenuItem key={index} value={tp}>
                      {tp}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Paper>
          <Paper
            sx={{
              width: '100%',
              padding: '2rem',
            }}>
            <Typography variant="h4">
              {t('artist.new-piece-page.paper-details')}
            </Typography>
            <Autocomplete
              multiple
              id="materials"
              options={[]}
              freeSolo
              value={materials}
              onChange={(
                _: React.SyntheticEvent<Element, Event>,
                newValue: string[] | null
              ) => {
                console.log(newValue);
                return newValue != null
                  ? setMaterials(newValue)
                  : setMaterials([]);
              }}
              inputValue={materialsInput}
              onInputChange={(_, newInputValue) => {
                setMaterialsInput(newInputValue);
              }}
              renderTags={(
                value: readonly string[],
                getTagProps
              ) =>
                value.map((option: string, index: number) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={t('product.materials')}
                  placeholder={t(
                    'product.materials-placeholder'
                  )}
                />
              )}
            />
            <Stack
              direction={'row'}
              spacing={2}
              sx={{ marginTop: '1rem', marginBottom: '1rem' }}
              alignItems={'center'}>
              <TextField
                fullWidth
                label={t('product.width')}
                value={maskedValues.width}
                onChange={handleMaskedValuesChange}
                name="width"
                id="formatted-width-input"
                InputProps={{
                  inputComponent: DimensionInput as any,
                }}
                variant="standard"
              />
              <Typography alignSelf={'flex-end'}>X</Typography>
              <TextField
                fullWidth
                label={t('product.height')}
                value={maskedValues.height}
                onChange={handleMaskedValuesChange}
                name="height"
                id="formatted-height-input"
                InputProps={{
                  inputComponent: DimensionInput as any,
                }}
                variant="standard"
              />
              <Typography alignSelf={'flex-end'}>X</Typography>
              <TextField
                fullWidth
                label={t('product.depth')}
                value={maskedValues.depth}
                onChange={handleMaskedValuesChange}
                name="depth"
                id="formatted-depth-input"
                InputProps={{
                  inputComponent: DimensionInput as any,
                }}
                variant="standard"
              />
            </Stack>
            <TextField
              fullWidth
              label={t('product.weight')}
              value={maskedValues.weight}
              onChange={handleMaskedValuesChange}
              name="weight"
              id="formatted-weight-input"
              InputProps={{
                inputComponent: DimensionInput as any,
              }}
              variant="standard"
            />
          </Paper>
          <Paper
            sx={{
              width: '100%',
              padding: '2rem',
            }}>
            <Typography variant="h4">
              {t('artist.new-piece-page.paper-photos')}
            </Typography>
            <input
              style={{ display: 'none' }}
              ref={inputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={onAddImage}
            />
            <Grid container marginTop={2} spacing={4}>
              {imageUrls.length === 0 && (
                <Grid xs={6} sm={4} md={3}>
                  <Box
                    component={'div'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    flexDirection={'column'}
                    sx={{
                      aspectRatio: '1/1',
                    }}>
                    <Tooltip
                      title={t(
                        'artist.new-piece-page.add-thumbnail'
                      )}>
                      <IconButton
                        sx={{ border: 2 }}
                        onClick={
                          addNewImageButtonClick
                        }>
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                    <Typography textAlign={'center'}>
                      {t(
                        'artist.new-piece-page.add-thumbnail'
                      )}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {imageUrls.map((url, index) => (
                <Grid xs={6} sm={4} md={3} key={index}>
                  <Box
                    component={'div'}
                    position={'relative'}
                    sx={{
                      aspectRatio: '1/1',
                      border: 2,
                      borderColor: theme.palette.primary,
                    }}>
                    <img
                      className="w-full h-full object-cover"
                      src={url}
                      alt={''}
                    />
                    <IconButton
                      size={'small'}
                      onClick={() => {
                        onDeleteImage(index);
                      }}
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        transform:
                          'translate(50%, -50%)',
                        color: theme.palette.primary
                          .contrastText,
                        backgroundColor:
                          theme.palette.mode ===
                            'dark'
                            ? theme.palette.primary
                              .light
                            : theme.palette.primary
                              .dark,
                        opacity: 1,
                        '&:hover': {
                          backgroundColor:
                            theme.palette.error
                              .dark,
                          opacity: 1,
                        },
                      }}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
              {imageUrls.length < MAX_IMAGES &&
                imageUrls.length > 0 && (
                  <Grid xs={6} sm={4} md={3}>
                    <Box
                      component={'div'}
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'center'}
                      flexDirection={'column'}
                      sx={{
                        aspectRatio: '1/1',
                      }}>
                      <Tooltip
                        title={t(
                          'artist.new-piece-page.add-photos'
                        )}>
                        <IconButton
                          sx={{ border: 2 }}
                          onClick={
                            addNewImageButtonClick
                          }>
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                      <Typography textAlign={'center'}>
                        {t(
                          'artist.new-piece-page.choose-photos'
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                )}
            </Grid>
          </Paper>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            size="large"
            style={{
              width: '50%',
              alignSelf: 'center',
            }}>
            {t('global.submit')}
          </Button>
        </Stack>
      </Box>
      <Slide direction="up" in={noPhotosError} mountOnEnter unmountOnExit>
        <Box
          className="fixed bottom-10"
          component={'div'}
          width={'100vw'}
          display={'flex'}
          justifyContent={'center'}>
          <Alert variant="filled" severity="error">
            {t('product.no-photos-error')}
          </Alert>
        </Box>
      </Slide>
    </>
  );
};

export default NewProduct;
