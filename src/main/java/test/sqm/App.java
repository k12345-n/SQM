/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package test.sqm;

import ucpbased.UCP;

public class App {
    public static void main(String[] args) {
        UCP ucp = new UCP();

        ucp.input_UUCW(0, 29, 0);
        ucp.input_UAW(0, 0, 5);
        ucp.input_TCF(3, 3, 3, 3, 0, 3, 3, 0, 3, 3, 3, 0, 3);
        ucp.input_ECF(3, 3, 3, 3, 3, 3, 0, 0);

        System.out.println(ucp.getUCP());
        System.out.println(ucp.getPF());
    }
}
