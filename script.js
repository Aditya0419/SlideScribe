// Initialize Swiper
// import Swiper from 'swiper';

// Initialize Swiper after the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const swiper = new Swiper(".swiper", {
    slidesPerView: "auto", // Adjusts to content
    spaceBetween: 10, // Proper spacing between slides
    //   freeMode: true, // Prevents fixed slide widths
  });

  // Go to specific slide
  function goToSlide(index) {
    swiper.slideTo(index); // Navigate to the slide
    updateActiveSlide(index); // Highlight the active thumbnail
  }

  // Function to update active thumbnail
  function updateActiveSlide(activeIndex) {
    const thumbnails = document.querySelectorAll(".view-panel .slide");
    thumbnails.forEach((thumb, index) => {
      thumb.classList.remove("active");
      if (index === activeIndex) {
        thumb.classList.add("active");
      }
    });
  }

  // Listen to Swiper's slide change event
  swiper.on("slideChange", () => {
    updateActiveSlide(swiper.activeIndex); // Sync active thumbnail on navigation
  });

  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  leftArrow.addEventListener("click", () => {
    swiper.slidePrev(); // Go to the previous slide
  });

  rightArrow.addEventListener("click", () => {
    swiper.slideNext(); // Go to the next slide
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      swiper.slidePrev(); // Go to previous slide when left arrow key is pressed
    } else if (event.key === "ArrowRight") {
      swiper.slideNext(); // Go to next slide when right arrow key is pressed
    }
  });

  // Make sure swiper is passed correctly to goToSlide
  window.goToSlide = goToSlide; // Ensure the goToSlide function is globally accessible

  // Function to add text box to the active slide
  // Function to add text box to the active slide
  function addText() {
    const activeSlide = document.querySelector(".swiper-slide-active");

    // Create a new text box div
    const textBox = document.createElement("div");
    textBox.className = "text-box";
    textBox.contentEditable = true; // Make it editable
    textBox.textContent = "Edit me"; // Default text

    // Style the text box
    textBox.style.position = "absolute";
    textBox.style.fontSize = "16px";
    textBox.style.width = "150px";
    textBox.style.padding = "5px";
    // textBox.style.background = "rgba(255, 255, 255, 0.8)";
    textBox.style.cursor = "move"; // Indicate that it's movable
    // textBox.style.border = "1px dashed"; // Border style for text box

    // Set initial position within the active slide (centered)
    const slideRect = activeSlide.getBoundingClientRect();
    textBox.style.left = `${slideRect.width / 2 - 75}px`; // Center the text box horizontally
    textBox.style.top = `${slideRect.height / 2 - 25}px`; // Center the text box vertically

    // Append the text box to the active slide
    activeSlide.appendChild(textBox);

    // Make the text box draggable
    makeDraggable(textBox);
    addResizeHandle(textBox);
  }

  // Function to make the text box draggable
  // Function to make the text box draggable
  function makeDraggable(textBox) {
    let isDragging = false;
    let offsetX, offsetY;

    // Prevent swiper slide when dragging text box
    let swiper = document.querySelector(".swiper").swiper;
    swiper.allowSlideNext = false; // Disable next slide
    swiper.allowSlidePrev = false; // Disable previous slide

    // Mouse down event to start dragging
    textBox.addEventListener("mousedown", (e) => {
      isDragging = true;

      swiper.allowSlideNext = false; // Disable next slide
      swiper.allowSlidePrev = false; // Disable previous slide

      const slideRect = document
        .querySelector(".swiper-slide-active")
        .getBoundingClientRect();
      offsetX = e.clientX - slideRect.left - textBox.offsetLeft;
      offsetY = e.clientY - slideRect.top - textBox.offsetTop;

      // Change cursor to indicate dragging
      textBox.style.cursor = "grabbing";

      // Prevent Swiper from swiping while dragging the text
      e.stopPropagation();
    });

    // Mouse move event to drag the text box
    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const slideRect = document
          .querySelector(".swiper-slide-active")
          .getBoundingClientRect();

        // Calculate the new position of the text box
        let newLeft = e.clientX - slideRect.left - offsetX;
        let newTop = e.clientY - slideRect.top - offsetY;

        // Constrain movement within the image bounds
        newLeft = Math.max(
          0,
          Math.min(slideRect.width - textBox.offsetWidth, newLeft)
        );
        newTop = Math.max(
          0,
          Math.min(slideRect.height - textBox.offsetHeight, newTop)
        );

        // Update the position of the text box
        textBox.style.left = `${newLeft}px`;
        textBox.style.top = `${newTop}px`;
      }
    });

    // Mouse up event to stop dragging
    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        textBox.style.cursor = "move"; // Reset cursor

        // Re-enable swiper sliding after dragging
        swiper.allowSlideNext = true;
        swiper.allowSlidePrev = true;
      }
    });

    // Prevent dragging behavior when interacting with the swiper container
    const swiperContainer = document.querySelector(".swiper");
    swiperContainer.addEventListener("mousedown", (e) => {
      if (isDragging) {
        e.stopPropagation(); // Prevent swiper slide when dragging text
      }
    });
  }

  // Function to add a resize handle to the text box
  function addResizeHandle(textBox) {
    const resizeHandle = document.createElement("div");
    resizeHandle.className = "resize-handle"; // Add resize class
    textBox.appendChild(resizeHandle);

    let isResizing = false;
    let initialFontSize, initialX, initialY;
    let swiper = document.querySelector(".swiper").swiper;

    resizeHandle.addEventListener("mousedown", (e) => {
        
        swiper.allowSlideNext = false; // Disable next slide
      swiper.allowSlidePrev = false;
        isResizing = true;
        initialFontSize = parseInt(window.getComputedStyle(textBox).fontSize);
        initialX = e.clientX;
        initialY = e.clientY;
        e.stopPropagation(); // Prevent swiper slide when resizing
    });

    document.addEventListener("mousemove", (e) => {
        if (isResizing) {
            let deltaY = e.clientY - initialY;
            let newFontSize = initialFontSize + deltaY;

            // Constrain to a reasonable font size range (you can adjust this)
            newFontSize = Math.max(10, Math.min(100, newFontSize)); // Minimum 10px, Maximum 100px

            textBox.style.fontSize = `${newFontSize}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        if (isResizing) {
            isResizing = false;
            swiper.allowSlideNext = true; // Disable next slide
      swiper.allowSlidePrev = true;
        }
    });
}


  window.addText = addText; // Assign the addText function to window for global access




});

let selectedTextBox = null;

    // Function to detect the selected text box and update the toolbar
    document.addEventListener("click", (e) => {
      if (e.target && e.target.classList.contains("text-box")) {
        selectedTextBox = e.target;
        updateToolbar();
      }
    });

    // Function to update toolbar based on selected text box properties
    function updateToolbar() {
      if (selectedTextBox) {
        const fontFamily = window.getComputedStyle(selectedTextBox).fontFamily;
        document.getElementById("font-family").value = fontFamily.replace(/['"]+/g, '');

        const fontSize = window.getComputedStyle(selectedTextBox).fontSize;
        document.getElementById("font-size").value = fontSize;

        const color = window.getComputedStyle(selectedTextBox).color;
        document.getElementById("font-color").value = rgbToHex(color);
      }
    }

    // Helper function to convert RGB color to Hex
    function rgbToHex(rgb) {
      const match = rgb.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
      if (match) {
        return `#${((1 << 24) | (parseInt(match[1]) << 16) | (parseInt(match[2]) << 8) | parseInt(match[3])).toString(16).slice(1)}`;
      }
      return rgb;
    }

    // Function to update the font family of the selected text
    function updateFontFamily() {
      if (selectedTextBox) {
        document.execCommand("fontName", false, document.getElementById("font-family").value);
      }
    }

    // Function to update the font size of the selected text
    function updateFontSize() {
      if (selectedTextBox) {
        document.execCommand("fontSize", false, document.getElementById("font-size").value);
      }
    }

    // Function to toggle bold style
    function toggleBold() {
      if (selectedTextBox) {
        document.execCommand("bold", false, null);
      }
    }

    // Function to toggle italic style
    function toggleItalic() {
      if (selectedTextBox) {
        document.execCommand("italic", false, null);
      }
    }

    // Function to toggle underline style
    function toggleUnderline() {
      if (selectedTextBox) {
        document.execCommand("underline", false, null);
      }
    }

    // Function to update the text color of the selected text
    function updateFontColor() {
        if (selectedTextBox) {
          const color = document.getElementById("font-color").value;
      
          // Check if there is any text selected within the contenteditable box
          const selection = window.getSelection();
          const range = selection.getRangeAt(0); // Get the selected range
      
          if (selection.toString().length > 0) {
            // Directly apply the color to the selected text
            const span = document.createElement("span");
            span.style.color = color;
            range.surroundContents(span); // Wrap the selected text with the span element
      
            // Alternatively, you can use execCommand to change color if required:
            // document.execCommand("foreColor", false, color);
          } else {
            // If no text is selected, change the color of the entire text box
            selectedTextBox.style.color = color;
          }
        }
      }

    // Function to align text within the text box (left, center, right)
    function alignLeft() {
      if (selectedTextBox) {
        document.execCommand("justifyLeft", false, null);
      }
    }

    function alignCenter() {
      if (selectedTextBox) {
        document.execCommand("justifyCenter", false, null);
      }
    }

    function alignRight() {
      if (selectedTextBox) {
        document.execCommand("justifyRight", false, null);
      }
    }