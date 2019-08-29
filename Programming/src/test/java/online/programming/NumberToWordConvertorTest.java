package online.programming;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.junit.MockitoJUnitRunner;

import online.programming.exception.InvalidInputException;

@RunWith(MockitoJUnitRunner.class)
public class NumberToWordConvertorTest {

	@InjectMocks
	NumberToWordConvertor numberToWordConvertor;

	@Test
	public void test_getBritishWord() {
		assertEquals("ten", numberToWordConvertor.getEnglishWord(10));
		assertEquals("nineteen", numberToWordConvertor.getEnglishWord(19));
	}
	
	@Test
	public void test_IdentifyWord() {
		assertEquals("nine hundred and ninety nine",numberToWordConvertor.identifyWord(999));
		assertEquals("three hundred and twenty",numberToWordConvertor.identifyWord(320));
		assertEquals("one hundred",numberToWordConvertor.identifyWord(100));
		assertEquals("ninety nine",numberToWordConvertor.identifyWord(99));
		assertEquals("nineteen",numberToWordConvertor.identifyWord(19));
	}
	
	@Test
	public void test_displayWord() {
		assertEquals("fifty six million nine hundred and forty five thousand seven hundred and eighty one",numberToWordConvertor.displayWord("56945781"));
		assertEquals("nine hundred and ninety nine million nine hundred and ninety nine thousand nine hundred and ninety nine",numberToWordConvertor.displayWord("999999999"));
		assertEquals("nine million",numberToWordConvertor.displayWord("9000000"));
		assertEquals("fifteen thousand",numberToWordConvertor.displayWord("15000"));
		assertEquals("one hundred and five",numberToWordConvertor.displayWord("105"));
		assertEquals("one million one thousand",numberToWordConvertor.displayWord("1001000"));
		assertEquals("two million two hundred",numberToWordConvertor.displayWord("2000200"));
		assertEquals("ninety million twenty three",numberToWordConvertor.displayWord("90000023"));
		
	}
	
	@Test(expected = NumberFormatException.class)
	public void test_displayWord_Exception1() {
	    numberToWordConvertor.displayWord("num");
	}
	
	@Test(expected = InvalidInputException.class)
	public void test_displayWord_Exception2() {
	    numberToWordConvertor.displayWord("-1");
	}
	
	@Test(expected = InvalidInputException.class)
	public void test_displayWord_Exception3() {
	    numberToWordConvertor.displayWord("999999999999");
	}

}
