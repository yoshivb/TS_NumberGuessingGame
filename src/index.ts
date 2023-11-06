import InvalidGuessResponses from "./invalid_responses.json"

enum InvalidGuessReponseType
{
	GameOver = 0,
	NotANumber,
	Infinite,
	LessThan1,
	MoreThan100
}

class NumberGuessingGame
{
	private inputField: HTMLInputElement | null;
	private responseContainer: HTMLElement | null;

	private actualNumber: number = 0;
	private guessAmount: number = 0;

	private gameFinished: boolean = false;

	private invalidGuessTypeCount: { [type: number]: number} = {};

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
			this.invalidGuessResponse(InvalidGuessReponseType.GameOver);
			return;
		}

		let guessValue = this.inputField.value;

		let guessNumber = Number.parseInt(guessValue);

		if(Number.isNaN(guessNumber))
		{
			this.invalidGuessResponse(InvalidGuessReponseType.NotANumber);
			return;
		}

		if(!Number.isFinite(guessNumber))
		{
			this.invalidGuessResponse(InvalidGuessReponseType.Infinite);
			return;
		}

		if(guessNumber < 1)
		{
			this.invalidGuessResponse(InvalidGuessReponseType.LessThan1);
			return;
		}

		if(guessNumber > 100)
		{
			this.invalidGuessResponse(InvalidGuessReponseType.MoreThan100);
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

	private guessResponse(response: string, validGuess: boolean = false)
	{
		if(!this.responseContainer)
		{
			return;
		}

		let responseElement = document.createElement("p");
		responseElement.textContent = response;
		if(validGuess)
		{
			responseElement.textContent += ` You've got ${this.guessAmount} guesses left.`;
		}

		this.responseContainer.insertBefore(responseElement, this.responseContainer.firstChild);
	}

	private invalidGuessResponse(type: InvalidGuessReponseType)
	{
		let guessType = InvalidGuessReponseType[type];

		if(this.invalidGuessTypeCount[type] === undefined)
		{
			this.invalidGuessTypeCount[type] = 0;
		}

		let guessResponseArray: string[] = (InvalidGuessResponses as any)[guessType];
		this.guessResponse(guessResponseArray[this.invalidGuessTypeCount[type] % guessResponseArray.length]);

		this.invalidGuessTypeCount[type]++;
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