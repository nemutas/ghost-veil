# About
In this application, the 'threejs plane' is overlaid on the 'dom element' to apply a special effect.

https://nemutas.github.io/ghost-veil/

![output(video-cutter-js com)](https://user-images.githubusercontent.com/46724121/175795833-79784279-ba17-47a8-b253-c1fdc6650bee.gif)

# Making
This application is made up of three layers.

### 1. dom layer
In this layer, the image is displayed and animated in response to scrolling using the GSAP Scroll Trigger.

### 2. plane layer (threejs canvas)
In this layer, the image source is obtained from the image element of the dom layer, and a grayscale texture is pasted onto the Plane.<br>
In addition, depending on the degree to which the image is displayed, it was expressed as if it were coming down like a dark curtain.

### 3. postprocessing layer (threejs canvas)
In this layer, the UVs of the screen are distorted and also made transparent in response to mouse movements.

# Technology

- Three.js
- TypeScript
- GLSL
- GSAP

# Reference
- [Yudouhu Portfolio](https://yudouhu.org/) - created by [itoh](https://twitter.com/FrontArtGraph)
- [Alien.js - flowmap](https://github.com/pschroen/alien.js/) - created by [Patrick Schroen](https://twitter.com/pschroen)
- [WLOP's excellent works](https://twitter.com/wlopwangling)

# License

This source code is not MIT License.

❌ Commercial use is prohibited.<br>
❌ Redistribution is prohibited.<br>
❌ Diversion is prohibited.（Incorporate all of the code into the project, etc.）<br>
✅ You can look at the application and reproduce the representation.<br>
✅ You can use parts of the code.

