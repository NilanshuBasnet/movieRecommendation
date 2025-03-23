import 'dotenv/config';
// Get the necessary elements
const sendButton = document.getElementById("send-user-prompt");
const userPrompt = document.getElementById("user-prompt");
const responseContainer = document.getElementById("response-container");
const homeContainer = document.getElementById("home-container");
const geminiResponse = document.getElementById("gemini-response");
const movieList = document.getElementById("movie-list");
// Get the image element by its ID
const refreshLogo = document.getElementById("only-logo");
// Add a click event listener to the image
refreshLogo.addEventListener("click", () => {
  location.reload(); // Reload the page
});

// Add an event listener for the Enter key press on the document
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      sendButton.click(); // Trigger the button's click event
    }
  });

// Add an event listener to the send button
sendButton.addEventListener("click", async () => {
  const prompt = userPrompt.value.trim();

  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }
  // Clear the textarea after sending the prompt
  userPrompt.value = "";
  userPrompt.placeholder = "Tell us what you like, and we'll find the perfect movie!"
  geminiResponse.textContent = "🤖 Generating response...";
  movieList.innerHTML = "";

  // Hide the home container and show the response container
  homeContainer.classList.add("hidden");
  responseContainer.classList.remove("hidden");

  try {
    const backendLink = process.env.BACKEND_URL;
    // Send the user input to the backend
    const response = await fetch(`${backendLink}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: prompt,
      }),
    });

    const data = await response.json();

    if (data.result) {
      // Display the AI response (example: movie recommendations)
      geminiResponse.textContent = "🌟 " + data.result.ai_response;

      // Loop through the movie data and create movie cards
      data.result.movies.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add(
          "rounded-lg",
          "overflow-hidden",
          "m-5",
          "flex",
          "flex-col",
          "w-60",
          "shadow-lg",
          "shadow-slate-600"
        );

        // Movie poster
        const moviePoster = document.createElement("img");
        moviePoster.src = movie.movie_poster;
        moviePoster.alt = "Movie Poster";
        moviePoster.classList.add("h-full");
        movieCard.appendChild(moviePoster);

        // Button for watching trailer
        const movieButtonContainer = document.createElement("div");
        movieButtonContainer.classList.add(
          "bg-[#1E2939]",
          "items-center",
          "flex",
          "justify-center"
        );

        const watchTrailerButton = document.createElement("button");
        watchTrailerButton.textContent = "🎬 Watch Trailer";
        watchTrailerButton.classList.add(
          "text-white",
          "cursor-pointer",
          "font-semibold",
          "rounded-xl",
          "bg-[#50C878]",
          "hover:bg-[#6fe797]",
          "pt-2",
          "pb-2",
          "pl-4",
          "pr-4",
          "m-3",
          "flex"
        );

        // Use default trailer link if not available
        const trailerLink =
          movie.movie_trailer === "Not Available"
            ? "https://www.youtube.com/watch?v=n_x5CtJGEDI"
            : movie.movie_trailer;

        watchTrailerButton.onclick = () => {
          window.open(trailerLink, "_blank");
        };

        movieButtonContainer.appendChild(watchTrailerButton);
        movieCard.appendChild(movieButtonContainer);

        // Append the movie card to the movie list
        movieList.appendChild(movieCard);
      });
      console.log(data);
    } else {
      geminiResponse.textContent =
        "Sorry, something went wrong. Please try again!";
    }
  } catch (error) {
    console.error("Error:", error);
    geminiResponse.textContent = "An error occurred. Please try again!";
  }
});
