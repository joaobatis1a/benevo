package com.benevo.util;

public class ValidarCPF {

    public static boolean isCPF(String cpf) {
        cpf = cpf.replaceAll("[^0-9]", " ");

        if (cpf.length() != 11) return false;

        if (cpf.matches("(\\d)\\1{10}")) return false;

        try {
            int sm = 0;
            int peso = 10;
            for (int i = 0; i < 9; i++) {
                sm += (cpf.charAt(i) - 48) * peso;
                peso--;
            }

            int r = 11 - (sm % 11);
            char dig10 = (r == 10 || r == 11) ? '0' : (char) (r + 48);

            sm = 0;
            peso = 11;
            for (int i = 0; i < 10; i++) {
                sm += (cpf.charAt(i) - 48) * peso;
                peso--;
            }

            r = 11 - (sm % 11);
            char dig11 = (r == 10 || r == 11) ? '0' : (char) (r + 48);

            return (dig10 == cpf.charAt(9)) && (dig11 == cpf.charAt(10));
        } catch (Exception e) {
            return false;
        }
    }
}
