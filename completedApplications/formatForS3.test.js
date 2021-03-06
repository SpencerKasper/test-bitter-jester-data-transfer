const formatForS3 = require('./formatForS3');

describe('FormatForS3', () => {
    const buildAnswers = (bandName, email, firstChoiceDate, secondChoiceDate, bandAvailability) => {
        const buildSingleAnswer = (name, answer) => {
            return {
                name: name,
                answer: answer
            };
        };
        return {
            "39": buildSingleAnswer("retypeYour", bandName),
            "289": buildSingleAnswer("retypeYour289", email),
            "77": buildSingleAnswer("selectYour77", firstChoiceDate),
            "78": buildSingleAnswer("selectYour", secondChoiceDate),
            "232": buildSingleAnswer("bandAvailability", bandAvailability),
            "312": buildSingleAnswer("phoneNUmber", {
                full: 'phone'
            }),
            "315": buildSingleAnswer("", 'citiesRepresented'),
            "80": buildSingleAnswer("", ['1','2'])
        };
    };

    const jotformResponse = [
        {
            answers: buildAnswers("bandName", "email", "1stChoiceDate", "2ndChoiceDate", "We are available for any of the Friday Night Concerts!")
        },
        {
            answers: buildAnswers("bandName2", "email2", undefined, undefined, "Not available")
        }
    ];

    const actual = formatForS3.format(jotformResponse).completedApplications;

    describe('band 1', () => {
        it('should return a name from the response', () => {
            expect(actual[0].bandName).toEqual('bandName');
        });

        it('should return a primary email from the response', () => {
            expect(actual[0].primaryEmailAddress).toEqual('email');
        });

        it('should return a 1st choice date from the response', () => {
            expect(actual[0].firstChoiceFridayNight).toEqual('1stChoiceDate');
        });

        it('should return a 2nd choice date from the response', () => {
            expect(actual[0].secondChoiceFridayNight).toEqual('2ndChoiceDate');
        });

        it('should return true for isBandAvailableOnAllFridays', () => {
            expect(actual[0].isBandAvailableOnAllFridays).toEqual(true);
        });

        it('should return phone number', () => {
            expect(actual[0].primaryPhoneNumber).toEqual('phone');
        });

        it('should return a citiesRepresented string', function () {
            expect(actual[0].citiesRepresented).toEqual('citiesRepresented');
        });

        it('should return a unavailableFridayNights array', function () {
            expect(actual[0].unavailableFridayNights).toEqual(['1','2']);
        });
    });

    describe('band 2', () => {
        it('should return a primary email for band 2', () => {
            expect(actual[1].bandName).toEqual('bandName2');
        });

        it('should return a primary email for band 2', () => {
            expect(actual[1].primaryEmailAddress).toEqual('email2');
        });

        it('should return an empty string for undefined firstChoiceDate for band 2', () => {
            expect(actual[1].firstChoiceFridayNight).toEqual('Available Every Friday');
        });

        it('should return an empty string for undefined secondChoiceDate for band 2', () => {
            expect(actual[1].secondChoiceFridayNight).toEqual('');
        });

        it('should return false for isBandAvailableOnAllFridays', () => {
            expect(actual[1].isBandAvailableOnAllFridays).toEqual(false);
        });
    });
});