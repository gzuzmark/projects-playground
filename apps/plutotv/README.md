// Step 1: render list of categories in a left column
// Step 2: onClick of a category the right column updates with a list of channels
// Step 3: allow user to favorite a channel
// which will create a favorite category if it does not exist.

// Bonus Points:
// use react best practices
// handle any channels without associated categories
// if img does not exist/load render placeholder img
// react hooks
// fully styled

// const defaultCategoryID = "5c12fe491cbd932b678e3d84";

// Step 1: render list of all categories in the left column
// a) display the category name and/or image

// Step 2: render list of all channels in the right column
// a) display the channel name
// b) display the channel number

// Step 3: onClick of a category filters the list of channels (associated with CategoryID)
// a) add state for a selected category
// b) create a filtered list based on the associated category
// c) if no channels are associated display 'no channels availible'

// If time allows...
// Step 3: allow user to favorite a channel
// which will create a favorite category if it does not exist.

// EXAMPLE CATEGORY OBJECT
// "5c12fe491cbd932b678e3d76": {
// id: "5c12fe491cbd932b678e3d76",
// name: "Chill Out",
// images: {
// svgImage: {
// defaultWidth: 90,
// defaultHeight: 90,
// url:
// "https://images.pluto.tv/channelcategory/5c12fe491cbd932b678e3d76/ChillOut-1550594973008.svg"
// }
// }
// },
