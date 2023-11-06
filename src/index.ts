class NumberGuessingGame
{
	private inputField: HTMLInputElement | null;
	private responseContainer: HTMLElement | null;

	private actualNumber: number = 0;
	private guessAmount: number = 0;

	private gameFinished: boolean = false;

	constructor()
	{
		this.inputField = document.querySelector<HTMLInputElement>("#guessInput");
		this.responseContainer = document.querySelector<HTMLElement>(".responseContainer");

		const makeGuessBtn = document.querySelector<HTMLInputElement>("#makeGuess");
		if(makeGuessBtn)
		{
			makeGuessBtn.addEventListener("click", () => this.makeGuess());
			this.inputField?.addEventListener("keypress", (ev) => {
				if (ev.key === "Enter") {
				  ev.preventDefault();
				  makeGuessBtn.click();
				}
			});
		}

		const restartGameBtn = document.querySelector<HTMLInputElement>("#restartGame");
		if(restartGameBtn)
		{
			restartGameBtn.addEventListener("click", () => this.reset());
		}

		this.initializeGame();
	}

	public initializeGame()
	{
		// [1-100]
		this.actualNumber = Math.floor(Math.random() * 100 + 1);
		this.guessAmount = 10;
		if(this.inputField)
		{
			this.inputField.value = "";
		}
		if(this.responseContainer)
		{
			this.responseContainer.innerHTML = "";
		}
	}

	public makeGuess()
	{
		if(!this.inputField)
		{
			return;
		}

		if(this.gameFinished)
		{
			this.guessResponse("The game is over, silly!");
			return;
		}

		let guessValue = this.inputField.value;

		let guessNumber = Number.parseInt(guessValue);

		if(Number.isNaN(guessNumber))
		{
			this.guessResponse("That's not a number!");
			return;
		}

		if(!Number.isFinite(guessNumber))
		{
			this.guessResponse("Infinite is definitely too much!");
			return;
		}

		if(guessNumber < 1)
		{
			this.guessResponse("That guess is smaller than allowed!");
			return;
		}

		if(guessNumber > 100)
		{
			this.guessResponse("That guess is bigger than allowed!");
			return;
		}

		this.guessAmount--;

		if(guessNumber == this.actualNumber)
		{
			this.guessResponse(`${guessNumber} is indeed the correct number!`, true);
			this.finishGame(true);
		}
		else if (guessNumber < this.actualNumber)
		{
			this.guessResponse(`${guessNumber} is smaller than the number!`, true);
		}
		else if (guessNumber > this.actualNumber)
		{
			this.guessResponse(`${guessNumber} is bigger than the number!`, true);
		}

		if(this.guessAmount == 0)
		{
			this.finishGame(false);
		}
	}

	private guessResponse(response: string, guessCounts: boolean = false)
	{
		if(!this.responseContainer)
		{
			return;
		}

		let responseElement = document.createElement("p");
		responseElement.textContent = response;
		if(guessCounts)
		{
			responseElement.textContent += ` You've got ${this.guessAmount} guesses left.`;
		}

		this.responseContainer.insertBefore(responseElement, this.responseContainer.firstChild);
	}

	private finishGame(hasWon: boolean)
	{
		if(hasWon)
		{
			this.guessResponse("You've won!");
		}
		else
		{
			this.guessResponse("You've lost!");
		}

		this.gameFinished = true;
	}

	private reset()
	{
		this.initializeGame();
	}
}

const Game = new NumberGuessingGame();