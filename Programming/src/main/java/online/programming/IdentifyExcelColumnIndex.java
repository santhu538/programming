package online.programming;

public class IdentifyExcelColumnIndex {

    private static final int NO_OF_ALPHABETS = 26;
    private static final int INITIAL_ASCII = 65;

    public static void main(String[] args) {

        int num = new IdentifyExcelColumnIndex().getNumber("BCD".toUpperCase());
        System.out.println("Index of the given excel column :: "+num);

    }

    public int getNumber(String column) {
        if(!isAlpha(column) || column == null || column.isEmpty()) {
            System.out.println("Invalid excel column");
            System.exit(0);
        }
        int index=0;
        while(column.length()>0){
            index += (column.charAt(0) - INITIAL_ASCII + 1) *  (int)Math.pow(NO_OF_ALPHABETS,column.length()-1);
            column = column.substring(1);
        }
        return index;
    }

    public boolean isAlpha(String s) {
        return s != null && s.matches("^[a-zA-Z]*$");
    }
}
