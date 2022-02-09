J$.iids = {"8":[12,21,12,25],"9":[2,19,2,23],"10":[4,9,4,21],"16":[9,17,9,32],"17":[2,19,2,23],"18":[7,14,7,24],"24":[8,25,8,35],"25":[2,19,2,23],"26":[8,25,8,35],"32":[16,13,16,20],"33":[3,18,3,20],"34":[8,37,8,40],"40":[7,14,7,24],"41":[3,18,3,20],"48":[4,9,4,21],"49":[3,18,3,20],"50":[8,37,8,40],"57":[4,9,4,15],"58":[9,17,9,27],"65":[4,20,4,21],"66":[9,17,9,32],"73":[5,18,5,27],"81":[5,18,5,27],"89":[5,9,5,28],"97":[7,14,7,20],"105":[7,23,7,24],"113":[8,22,8,23],"121":[8,22,8,23],"129":[8,22,8,23],"137":[8,25,8,26],"145":[8,29,8,35],"161":[8,37,8,38],"169":[8,37,8,40],"185":[9,17,9,23],"193":[9,26,9,27],"201":[9,31,9,32],"209":[10,27,10,32],"217":[10,27,10,32],"225":[10,17,10,33],"233":[12,21,12,25],"241":[16,13,16,20],"249":[17,22,17,29],"257":[17,22,17,29],"265":[17,13,17,29],"273":[19,21,19,32],"281":[19,21,19,32],"289":[19,12,19,32],"297":[23,18,23,29],"305":[23,18,23,29],"313":[23,9,23,29],"321":[25,5,25,12],"329":[25,17,25,23],"337":[25,5,25,24],"339":[25,5,25,16],"345":[25,5,25,25],"353":[1,1,26,2],"361":[1,1,26,2],"369":[1,1,26,2],"377":[1,1,26,2],"385":[1,1,26,2],"393":[1,1,26,2],"401":[28,1,28,8],"409":[28,9,28,11],"417":[28,1,28,12],"425":[28,1,28,13],"433":[1,1,29,1],"441":[1,1,26,2],"449":[1,1,29,1],"457":[12,17,13,27],"465":[9,13,14,14],"473":[8,9,15,10],"481":[8,9,15,10],"489":[16,9,20,10],"497":[7,10,24,6],"505":[4,5,24,6],"513":[1,1,26,2],"521":[1,1,26,2],"529":[1,1,29,1],"537":[1,1,29,1],"nBranches":12,"originalCodeFileName":"/home/v/slicing/testcases/milestone3/preproc_b1_in.js","instrumentedCodeFileName":"/home/v/slicing/testcases/milestone3/preproc_b1_in_jalangi_.js","code":"function sliceMe(number) {    \n    var isPrime = true;\n    var status = \"\";    \n    if (number === 1) {\n        status = \"neither\";\n    }  \n    else if (number > 1) {        \n        for (var i = 2; i < number; i++) {\n            if (number % i == 0) {\n                isPrime = false;\n\n                if (true)\n                    break;\n            }\n        }\n        if (isPrime) {\n            status = \"prime\"\n        } else {\n           status = \"composite\"\n        }\n    }\n    else {\n        status = \"composite\"\n    }\n    console.log(status);\n}\n\nsliceMe(12);\n"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(433, '/home/v/slicing/testcases/milestone3/preproc_b1_in_jalangi_.js', '/home/v/slicing/testcases/milestone3/preproc_b1_in.js');
            function sliceMe(number) {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(353, arguments.callee, this, arguments);
                            arguments = J$.N(361, 'arguments', arguments, 4);
                            number = J$.N(369, 'number', number, 4);
                            J$.N(377, 'isPrime', isPrime, 0);
                            J$.N(385, 'status', status, 0);
                            J$.N(393, 'i', i, 0);
                            var isPrime = J$.X1(25, J$.W(17, 'isPrime', J$.T(9, true, 23, false), isPrime, 1));
                            var status = J$.X1(49, J$.W(41, 'status', J$.T(33, "", 21, false), status, 1));
                            if (J$.X1(505, J$.C(48, J$.B(10, '===', J$.R(57, 'number', number, 0), J$.T(65, 1, 22, false), 0)))) {
                                J$.X1(89, status = J$.W(81, 'status', J$.T(73, "neither", 21, false), status, 0));
                            } else if (J$.X1(497, J$.C(40, J$.B(18, '>', J$.R(97, 'number', number, 0), J$.T(105, 1, 22, false), 0)))) {
                                for (var i = J$.X1(129, J$.W(121, 'i', J$.T(113, 2, 22, false), i, 1)); J$.X1(473, J$.C(24, J$.B(26, '<', J$.R(137, 'i', i, 0), J$.R(145, 'number', number, 0), 0))); J$.X1(481, J$.B(50, '-', i = J$.W(169, 'i', J$.B(42, '+', J$.U(34, '+', J$.R(161, 'i', i, 0)), J$.T(153, 1, 22, false), 0), i, 0), J$.T(177, 1, 22, false), 0))) {
                                    if (J$.X1(465, J$.C(16, J$.B(66, '==', J$.B(58, '%', J$.R(185, 'number', number, 0), J$.R(193, 'i', i, 0), 0), J$.T(201, 0, 22, false), 0)))) {
                                        J$.X1(225, isPrime = J$.W(217, 'isPrime', J$.T(209, false, 23, false), isPrime, 0));
                                        if (J$.X1(457, J$.C(8, J$.T(233, true, 23, false))))
                                            break;
                                    }
                                }
                                if (J$.X1(489, J$.C(32, J$.R(241, 'isPrime', isPrime, 0)))) {
                                    J$.X1(265, status = J$.W(257, 'status', J$.T(249, "prime", 21, false), status, 0));
                                } else {
                                    J$.X1(289, status = J$.W(281, 'status', J$.T(273, "composite", 21, false), status, 0));
                                }
                            } else {
                                J$.X1(313, status = J$.W(305, 'status', J$.T(297, "composite", 21, false), status, 0));
                            }
                            J$.X1(345, J$.M(337, J$.R(321, 'console', console, 2), 'log', 0)(J$.R(329, 'status', status, 0)));
                        } catch (J$e) {
                            J$.Ex(513, J$e);
                        } finally {
                            if (J$.Fr(521))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(449, 'sliceMe', J$.T(441, sliceMe, 12, false, 353), 0);
            J$.X1(425, J$.F(417, J$.R(401, 'sliceMe', sliceMe, 1), 0)(J$.T(409, 12, 22, false)));
        } catch (J$e) {
            J$.Ex(529, J$e);
        } finally {
            if (J$.Sr(537)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
