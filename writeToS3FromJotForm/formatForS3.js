const extractAnswersFromJotform = require('./extractAnswersFromJotforrm');

const jotformAnswerMap = {
    bandName: '39',
    primaryEmailAddress: '289',
    firstChoiceFridayNight: '77',
    secondChoiceFridayNight: '78',
    isBandAvailableOnAllFridays: '232'
};

const format = (applications) => {

    const convertIsBandAvailableOnFridays = (isBandAvailableStringField) => {
        return !isBandAvailableStringField.toLowerCase().includes('not available');
    };

    const extractedApplications = extractAnswersFromJotform.extractAnswersFromJotform(applications, jotformAnswerMap);
    const cleanedApplications = extractedApplications.completedApplications.map(app => {
        const bandAvailableOnAllFridays = app.isBandAvailableOnAllFridays;
        const firstChoiceFridayNight = app.firstChoiceFridayNight;
        const secondChoiceFridayNight = app.secondChoiceFridayNight;

        if(bandAvailableOnAllFridays){
            app.isBandAvailableOnAllFridays = convertIsBandAvailableOnFridays(bandAvailableOnAllFridays);
        }

        if(!firstChoiceFridayNight){
            app.firstChoiceFridayNight = 'Available Every Friday'
        }

        if(!secondChoiceFridayNight){
            app.secondChoiceFridayNight = ''
        }
        return app;
    });

    return {
        completedApplications: cleanedApplications
    };
};

module.exports = {
    format: format
}