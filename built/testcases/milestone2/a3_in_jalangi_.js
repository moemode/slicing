J$.iids = { "9": [5, 9, 5, 10], "10": [6, 9, 6, 14], "17": [5, 9, 5, 10], "18": [7, 9, 7, 14], "25": [5, 5, 5, 11], "33": [6, 9, 6, 10], "41": [6, 13, 6, 14], "49": [6, 9, 6, 14], "57": [6, 5, 6, 15], "65": [7, 9, 7, 10], "73": [7, 13, 7, 14], "81": [7, 9, 7, 14], "89": [7, 5, 7, 15], "97": [8, 12, 8, 13], "105": [8, 12, 8, 13], "113": [8, 5, 8, 14], "121": [1, 1, 9, 2], "129": [1, 1, 9, 2], "137": [1, 1, 9, 2], "145": [1, 1, 9, 2], "153": [1, 1, 9, 2], "161": [11, 1, 11, 8], "169": [11, 1, 11, 10], "177": [11, 1, 11, 11], "185": [1, 1, 11, 11], "193": [1, 1, 9, 2], "201": [1, 1, 11, 11], "209": [1, 1, 9, 2], "217": [1, 1, 9, 2], "225": [1, 1, 11, 11], "233": [1, 1, 11, 11], "nBranches": 0, "originalCodeFileName": "/home/v/slicing/slicer/testcases/milestone2/a3_in.js", "instrumentedCodeFileName": "/home/v/slicing/slicer/testcases/milestone2/a3_in_jalangi_.js", "code": "function sliceMe() {\n    var x;\n    var y;\n    var z;\n    x = 1;\n    y = 2 + x;\n    z = 3 + x;\n    return x;\n}\n\nsliceMe();" };
jalangiLabel1: while (true) {
    try {
        J$.Se(185, '/home/v/slicing/slicer/testcases/milestone2/a3_in_jalangi_.js', '/home/v/slicing/slicer/testcases/milestone2/a3_in.js');
        function sliceMe() {
            jalangiLabel0: while (true) {
                try {
                    J$.Fe(121, arguments.callee, this, arguments);
                    arguments = J$.N(129, 'arguments', arguments, 4);
                    J$.N(137, 'x', x, 0);
                    J$.N(145, 'y', y, 0);
                    J$.N(153, 'z', z, 0);
                    var x;
                    var y;
                    var z;
                    J$.X1(25, x = J$.W(17, 'x', J$.T(9, 1, 22, false), x, 0));
                    J$.X1(57, y = J$.W(49, 'y', J$.B(10, '+', J$.T(33, 2, 22, false), J$.R(41, 'x', x, 0), 0), y, 0));
                    J$.X1(89, z = J$.W(81, 'z', J$.B(18, '+', J$.T(65, 3, 22, false), J$.R(73, 'x', x, 0), 0), z, 0));
                    return J$.X1(113, J$.Rt(105, J$.R(97, 'x', x, 0)));
                }
                catch (J$e) {
                    J$.Ex(209, J$e);
                }
                finally {
                    if (J$.Fr(217))
                        continue jalangiLabel0;
                    else
                        return J$.Ra();
                }
            }
        }
        sliceMe = J$.N(201, 'sliceMe', J$.T(193, sliceMe, 12, false, 121), 0);
        J$.X1(177, J$.F(169, J$.R(161, 'sliceMe', sliceMe, 1), 0)());
    }
    catch (J$e) {
        J$.Ex(225, J$e);
    }
    finally {
        if (J$.Sr(233)) {
            J$.L();
            continue jalangiLabel1;
        }
        else {
            J$.L();
            break jalangiLabel1;
        }
    }
}
// JALANGI DO NOT INSTRUMENT
