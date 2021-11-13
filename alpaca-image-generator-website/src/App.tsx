import React, { useState, useEffect } from 'react'
import { css } from '@emotion/react'
import mergeImages from 'merge-images'
import { Button, Grid, Typography, Stack, Chip, Skeleton } from '@mui/material'
/** @jsxImportSource @emotion/react */

const styleApp = css`
  text-align: center;
  h1 {
    padding: 20px;
  }
  .generator-container {
    display: flex;
    justify-content: center;
    width: 50%;
    margin: auto;
  }
  .image-container img {
    width: -webkit-fill-available;
  }
  .buttonGroup button {
    padding: 6px 24px;
    margin: 12px;
  }
  .setting-container {
    padding-left: 48px !important;
    p {
      text-align: left;
      font-size: 20px;
      font-weight: bold;
    }
  }
  .chipsGroup {
    flex-wrap: wrap;
    margin-bottom: 20px;
    .MuiChip-root {
      margin: 4px;
    }
  }
`

enum ACCESSORIES {
  hair = 'hair',
  ears = 'ears',
  eyes = 'eyes',
  mouth = 'mouth',
  neck = 'neck',
  leg = 'leg',
  accessories = 'accessories',
  backgrounds = 'backgrounds',
  nose = 'nose',
}

type TImageSettingChildren = {
  label: string
  fileName: string
}

type TExcludeAccessories = Exclude<ACCESSORIES, ACCESSORIES.nose>

type TImageSetting = {
  [key in TExcludeAccessories]: {
    label: string
    enumType: TExcludeAccessories // key is always string so enumType should be in value as well
    children: TImageSettingChildren[]
  }
}

const imageSettings: TImageSetting = {
  hair: {
    enumType: ACCESSORIES.hair,
    label: 'hair',
    children: [
      { label: 'default', fileName: 'default.png' },
      { label: 'bang', fileName: 'bang.png' },
      { label: 'curls', fileName: 'curls.png' },
      { label: 'elegant', fileName: 'elegant.png' },
      { label: 'fancy', fileName: 'fancy.png' },
      { label: 'quiff', fileName: 'quiff.png' },
      { label: 'short', fileName: 'short.png' },
    ],
  },
  ears: {
    enumType: ACCESSORIES.ears,
    label: 'ears',
    children: [
      { label: 'default', fileName: 'default.png' },
      { label: 'tilt-backward', fileName: 'tilt-backward.png' },
      { label: 'tilt-forward', fileName: 'tilt-forward.png' },
    ],
  },
  eyes: {
    enumType: ACCESSORIES.eyes,
    label: 'eyes',
    children: [
      { label: 'default', fileName: 'default.png' },
      { label: 'angry', fileName: 'angry.png' },
      { label: 'naughty', fileName: 'naughty.png' },
      { label: 'panda', fileName: 'panda.png' },
      { label: 'smart', fileName: 'smart.png' },
      { label: 'star', fileName: 'star.png' },
    ],
  },
  mouth: {
    enumType: ACCESSORIES.mouth,
    label: 'mouth',
    children: [
      { label: 'default', fileName: 'default.png' },
      { label: 'astonished', fileName: 'astonished.png' },
      { label: 'eating', fileName: 'eating.png' },
      { label: 'laugh', fileName: 'laugh.png' },
      { label: 'tongue', fileName: 'tongue.png' },
    ],
  },
  neck: {
    enumType: ACCESSORIES.neck,
    label: 'neck',
    children: [
      { label: 'default', fileName: 'default.png' },
      { label: 'bend-backward', fileName: 'bend-backward.png' },
      { label: 'bend-forward', fileName: 'bend-forward.png' },
      { label: 'thick', fileName: 'thick.png' },
    ],
  },
  leg: {
    enumType: ACCESSORIES.leg,
    label: 'leg',
    children: [
      { label: 'default', fileName: 'default.png' },
      { label: 'bubble-tea', fileName: 'bubble-tea.png' },
      { label: 'cookies', fileName: 'cookies.png' },
      { label: 'game-console', fileName: 'game-console.png' },
      { label: 'tilt-backward', fileName: 'tilt-backward.png' },
      { label: 'tilt-forward', fileName: 'tilt-forward.png' },
    ],
  },
  accessories: {
    enumType: ACCESSORIES.accessories,
    label: 'accessories',
    children: [
      { label: 'earings', fileName: 'earings.png' },
      { label: 'flower', fileName: 'flower.png' },
      { label: 'glasses', fileName: 'glasses.png' },
      { label: 'headphone', fileName: 'headphone.png' },
    ],
  },
  backgrounds: {
    enumType: ACCESSORIES.backgrounds,
    label: 'background',
    children: [
      { label: 'blue 50', fileName: 'blue50.png' },
      { label: 'blue 60', fileName: 'blue60.png' },
      { label: 'blue 70', fileName: 'blue70.png' },
      { label: 'dark blue 30', fileName: 'darkblue30.png' },
      { label: 'dark blue 50', fileName: 'darkblue50.png' },
      { label: 'dark blue 70', fileName: 'darkblue70.png' },
      { label: 'green 50', fileName: 'green50.png' },
      { label: 'green 60', fileName: 'green60.png' },
      { label: 'green 70', fileName: 'green70.png' },
      { label: 'grey 40', fileName: 'grey40.png' },
      { label: 'grey 70', fileName: 'grey70.png' },
      { label: 'grey 80', fileName: 'grey80.png' },
      { label: 'red 50', fileName: 'red50.png' },
      { label: 'red 60', fileName: 'red60.png' },
      { label: 'red 70', fileName: 'red70.png' },
      { label: 'yellow 50', fileName: 'yellow50.png' },
      { label: 'yellow 60', fileName: 'yellow60.png' },
      { label: 'yellow 70', fileName: 'yellow70.png' },
    ],
  },
}

const App = () => {
  const [settings, setSettings] = useState<{ [key in ACCESSORIES]: string }>({
    backgrounds: 'blue70.png',
    neck: 'default.png',
    leg: 'default.png',
    ears: 'default.png',
    nose: 'default.png',
    mouth: 'default.png',
    hair: 'default.png',
    eyes: 'default.png',
    accessories: 'headphone.png',
  })

  const [selectedAccessory, setSelectedAccessory] =
    useState<TExcludeAccessories>(ACCESSORIES.hair)
  const [alpacaImage, setAlpacaImage] = useState<string | null>(null)

  useEffect(() => {
    const imageList: string[] = Object.entries(settings).map(
      ([key, value]) => `alpaca/${key}/${value}`
    )
    mergeImages(imageList).then((b64) => setAlpacaImage(b64))
  }, [settings])

  const randomImages = () => {
    const newSettings: { [key in ACCESSORIES]: string } = { ...settings }
    Object.values(imageSettings).map((value) => {
      const randomNum = Math.floor(Math.random() * value.children.length)
      newSettings[value.enumType] = value.children[randomNum].fileName
      return null
    })
    setSettings(newSettings)
  }

  return (
    <main className="app" css={styleApp}>
      <Typography variant="h3" component="h1">
        Alpaca Generator
      </Typography>
      <Grid className="generator-container" container spacing={2}>
        <Grid className="image-container" item xs={6}>
          {alpacaImage ? (
            <img src={alpacaImage} alt="alpaca" />
          ) : (
            <Skeleton variant="rectangular" width={460} height={460} />
          )}
          <div className="buttonGroup">
            <Button variant="outlined" onClick={randomImages}>
              Random
            </Button>
            <Button variant="outlined">Download</Button>
          </div>
        </Grid>
        <Grid className="setting-container" item xs={6}>
          <Typography variant="body1" gutterBottom>
            Accessorize the alpaca
          </Typography>
          <Stack className="chipsGroup" direction="row" spacing={1}>
            {Object.values(imageSettings).map((value) => (
              <Chip
                label={value.label}
                variant={
                  (selectedAccessory !== value.enumType && 'outlined') ||
                  undefined
                }
                onClick={() => setSelectedAccessory(value.enumType)}
              />
            ))}
          </Stack>
          <Typography variant="body1" gutterBottom>
            Style
          </Typography>
          <Stack className="chipsGroup" direction="row" spacing={1}>
            {imageSettings[selectedAccessory]?.children?.map((value) => (
              <Chip
                label={value.label}
                variant={
                  (settings[selectedAccessory] !== value.fileName &&
                    'outlined') ||
                  undefined
                }
                onClick={() =>
                  setSettings((prev) => {
                    const newSettings = { ...prev }
                    newSettings[selectedAccessory] = value.fileName
                    return newSettings
                  })
                }
              />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </main>
  )
}

export default App
