package online.programming;

import online.programming.exception.InvalidInputException;

public class NumberToWordConvertor {

    private static final String SPACE = " ";
	private static final String AND = "and";
	private static final int MILLION = 1000000;
	private static final int THOUSAND = 1000;
	private static final int HUNDRED = 100;
	private static final int TEN = 10;
	private static final int LOWEST = 1;
	private static final int HIGHEST = 999999999;


	public static void main(String[] args) {
		if(args.length == 0) {
			System.out.println("argument is required.");
			System.exit(0);
		}
        String word = new NumberToWordConvertor().displayWord(args[0]);
        System.out.println("British English words for the given number is :: "+word);
    }
    
    

	/**
	 * This method validates the input and convert the given number into British English words.
	 * @param number
	 * @return
	 */
    public String displayWord(String number) {
    	int num = 0;
    	try {
    		long longNum = Long.parseLong(number);
    		if(longNum < LOWEST || longNum > HIGHEST) {
    			throw new InvalidInputException("Number not in range (1 - 999999999)");
    		}
    		num = (int)longNum;
    	}
    	catch(InvalidInputException ie) {
    		System.err.println(ie.getMessage());
    		System.exit(0);
    	}
    	catch(NumberFormatException nfe) {
    		System.err.println("Not a valid number");
    		System.exit(0);
    	}
    	
    	StringBuilder numberToWord = new StringBuilder();
		if(num >= MILLION) {
			numberToWord.append(identifyWord(num/MILLION)).append(SPACE).append("million");	
			num = num % MILLION;
		}
		if(num >= THOUSAND) {
			if(numberToWord.length() > 0) {
				numberToWord.append(SPACE);
			}
			numberToWord.append(identifyWord(num/THOUSAND)).append(SPACE).append("thousand");	
			num = num % THOUSAND;
		}
		if(num > 0) {
			if(numberToWord.length() > 0) {
				numberToWord.append(SPACE);
			}
			numberToWord.append(identifyWord(num));
		}
		return numberToWord.toString();
	}



    /**
     * this method returns the British words for the number. 
     * 0 > number < THOUSAND
     * @param num
     * @return
     */
	public String identifyWord(int num) {
		StringBuilder numberToWord = new StringBuilder();
		if(num >= HUNDRED) {
			numberToWord.append(getEnglishWord(num/HUNDRED)).append(SPACE).append("hundred");
			num = num % HUNDRED;
			if(num != 0) {
				numberToWord.append(SPACE).append(AND).append(SPACE);
			}
		}
		if(num % TEN != 0 && num > 19) {
			numberToWord.append(getEnglishWord(num - num % TEN)).append(SPACE);
			num = num % TEN;
			numberToWord.append(getEnglishWord(num));
		}
		else {
			numberToWord.append(getEnglishWord(num));
		}
		
		return numberToWord.toString();
	}



	/**
	 * This method return the English word for the given number.
	 * @param num
	 * @return
	 */
	String getEnglishWord(int num) {

        switch (num) {
            case 1:
                return "one";
            case 2:
                return "two";
            case 3:
                return "three";
            case 4:
                return "four";
            case 5:
                return "five";
            case 6:
                return "six";
            case 7:
                return "seven";
            case 8:
                return "eight";
            case 9:
                return "nine";
            case 10:
                return "ten";
            case 11:
                return "eleven";
            case 12:
                return "twelve";
            case 13:
                return "thirteen";
            case 14:
                return "fourteen";
            case 15:
                return "fifteen";
            case 16:
                return "sixteen";
            case 17:
                return "seventeen";
            case 18:
                return "eighteen";
            case 19:
                return "nineteen";
            case 20:
                return "twenty";
            case 30:
                return "thirty";
            case 40:
                return "forty";
            case 50:
                return "fifty";
            case 60:
                return "sixty";
            case 70:
                return "seventy";
            case 80:
                return "eighty";
            case 90:
                return "ninety";
            default: 
            	return "";
        }

    }
}
