package online.programming;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.junit.MockitoJUnitRunner;

import static org.junit.Assert.*;

@RunWith(MockitoJUnitRunner.class)
public class IdentifyExcelColumnIndexTest {
    @InjectMocks
    IdentifyExcelColumnIndex identifyExcelColumnIndex;

    @Test
    public void test_getNumber() {
        assertEquals(2759,identifyExcelColumnIndex.getNumber("DBC"));
        assertEquals(16382,identifyExcelColumnIndex.getNumber("XFB"));
        assertEquals(498,identifyExcelColumnIndex.getNumber("SD"));
        assertEquals(391,identifyExcelColumnIndex.getNumber("OA"));
        assertEquals(25,identifyExcelColumnIndex.getNumber("Y"));
    }

    @Test
    public void test_isALpha() {
        assertTrue(identifyExcelColumnIndex.isAlpha("DBC"));
        assertFalse(identifyExcelColumnIndex.isAlpha("DB2"));
        assertFalse(identifyExcelColumnIndex.isAlpha("233"));
    }
}