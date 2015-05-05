/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('cardioCatalogQT.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-view',

    requires: [
        'Ext.window.MessageBox'
    ],

    onExecuteClick: function (button) {
        var options = {
            delimiter: null
        },
            payload = Ext.getStore('Payload'),
            url;

        // construct URL and submit criteria to Query store
        if (payload.getCount() > 0) {
            url = cardioCatalogQT.service.UtilityService.url(payload, options);
        }
        // if no criteria have been selected then run the last generated query
        else {
            url = cardioCatalogQT.service.UtilityService.url_request();
        }

        cardioCatalogQT.service.UtilityService.submit_query(button, url);
    },

    onSearchClick: function (button) {
        var url;

        // get last submitted url
        url = cardioCatalogQT.service.UtilityService.url_request();

        cardioCatalogQT.service.UtilityService.submit_query(button, url);
    },

    onShowClick: function (button) {
        var panel = button.up('form').up().down('#results'),
            store = Ext.getStore('Payload');
        // render template
        cardioCatalogQT.service.UtilityService.criteria_template(panel, store);
    },

    onSubmitDemographics: function (button) {
        var payload = Ext.getStore('Payload'),
            demo = [],
            form = button.up('form'),
            sexValue = form.down('#sexValue').value,
            ageComparator = form.down('#ageComparator').value,
            ageValue = form.down('#ageValue').value,
            upperAge = form.down('#upperAge').value;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show object demographics');
            console.log(sexValue);
            console.log(ageComparator);
            console.log(ageValue);
            console.log(upperAge);
        }

        // insert sex only if exists
        if (sexValue) {

            if ((ageComparator === 'bt' &&
                ageValue &&
                upperAge) ||

                (ageComparator !== 'bt' &&
                ageValue &&
                !upperAge) ||

                (ageComparator !== 'bt' &&
                !ageValue &&
                !upperAge)) {

                payload.add({
                    type: 'sex',
                    key: 'sex',
                    comparator: 'eq',
                    comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash('eq'),
                    value: sexValue
                });

                payload.sync();
            }
            else {

                // error conditionals here
            }
        }

        // insert only if exists
        if (ageValue) {

            var test_age = ageValue;

            if (ageComparator === 'bt') {

                if (!upperAge) {
                    alert('Please enter max age to continue')
                }
                else {
                    test_age += ',' + upperAge;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('test age: ' + test_age);
            }

            if ((ageComparator === 'bt' &&
                ageValue &&
                upperAge) ||

                (!upperAge &&
                ageComparator !== 'bt' &&
                ageValue)) {

                payload.add({
                    type: 'age',
                    key: 'age',
                    comparator: ageComparator,
                    comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(ageComparator),
                    value: test_age
                });

                payload.sync();
            }
            else{
                // error conditions here
            }
        }

        if (cardioCatalogQT.config.mode === 'test') {
            demo.push(sexValue);
            demo.push(ageComparator);
            demo.push(ageValue);
            demo.push(upperAge);
            console.log('demographics:');
            console.log(demo);
        }

        // reload store on grid
        form.up().down('#searchGrid').getStore().load();
    },

    onSubmitVitals: function(button) {
        var payload = Ext.getStore('Payload'),
            vitals = [],
            form = button.up('form'),
            systolicComparator = form.down('#systolicComparator').value,
            systolicValue = form.down('#systolicValue').value,
            upperSystolic = form.down('#upperSystolic').value,
            diastolicComparator = form.down('#diastolicComparator').value,
            diastolicValue = form.down('#diastolicValue').value,
            upperDiastolic = form.down('#upperDiastolic').value,
            vitalWhenComparator = form.down('#vitalWhenComparator').value,
            vitalWhenValue = form.down('#vitalWhenValue').value,
            upperVitalWhen = form.down('#upperVitalWhen').value,
            whenValue = Ext.Date.format(vitalWhenValue, 'Y-m-d'),
            upperWhenValue = Ext.Date.format(upperVitalWhen, 'Y-m-d');

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show object vitals');
            console.log(systolicComparator);
            console.log(systolicValue);
            console.log(diastolicComparator);
            console.log(diastolicValue);
            console.log(vitalWhenComparator);
            console.log(vitalWhenValue);
            console.log(upperVitalWhen);
        }

        if (systolicValue || diastolicValue) {

            var test_systolic = systolicValue,
                test_diastolic = diastolicValue,
                test_date = whenValue;


            if (vitalWhenComparator === 'bt') {

                if (!upperVitalWhen) {
                    alert('Please enter max diastolic to continue')
                }
                else {
                    test_date += ',' + upperWhenValue;
                }
            }


            if (systolicComparator === 'bt') {

                if (!upperSystolic) {
                    alert('Please enter max systolic to continue')
                }
                else {
                    test_systolic += ',' + upperSystolic ;
                }
            }

            if (diastolicComparator === 'bt') {

                if (!upperDiastolic) {
                    alert('Please enter max diastolic to continue')
                }
                else {
                    test_diastolic += ',' + upperDiastolic;
                }
            }


            if (cardioCatalogQT.config.mode === 'test') {
                console.log('test systolic : ' + test_systolic);
                console.log('test diastolic: ' + test_diastolic);
                console.log('test date: ' + test_date);
                console.log('systolic' + systolicValue);
                console.log('systolicComp' + systolicComparator);
                console.log('systolicUpper' + upperSystolic);
                console.log('diastolic' + systolicValue);
                console.log('diastolicComp' + systolicComparator);
                console.log('diastolicUpper' + upperSystolic);
                console.log('when ' + whenValue);
                console.log('whenComp' + vitalWhenComparator);
                console.log('whenUpper' + upperWhenValue);

            }

            // insert only if exists
            if (((systolicComparator === 'bt' &&
                systolicValue &&
                upperSystolic) ||

                (!upperSystolic &&
                systolicComparator !== 'bt' &&
                systolicValue) ||

                (!systolicValue)) &&

                ((diastolicComparator === 'bt' &&
                diastolicValue &&
                upperDiastolic) ||

                (!upperDiastolic &&
                diastolicComparator !== 'bt' &&
                diastolicValue) ||

                (!diastolicValue))) {

                if (systolicValue) {
                    payload.add({
                        type: 'blood_pressure_systolic',
                        key: 'blood_pressure_systolic',
                        comparator: systolicComparator,
                        comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(systolicComparator),
                        value: test_systolic,
                        dateComparator: vitalWhenComparator,
                        dateComparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(vitalWhenComparator),
                        dateValue: test_date
                    });

                    payload.sync();
                    console.log('YESH')
                }

                if (diastolicValue) {

                    payload.add({
                        type: 'blood_pressure_diastolic',
                        key: 'blood_pressure_diastolic',
                        comparator: diastolicComparator,
                        comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(diastolicComparator),
                        value: test_diastolic,
                        dateComparator: vitalWhenComparator,
                        dateComparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(vitalWhenComparator),
                        dateValue: test_date
                    });
                    payload.sync();
                }
            }
            else {
                // error conditions here
            }

            if (cardioCatalogQT.config.mode === 'test') {
                vitals.push(systolicComparator);
                vitals.push(systolicValue);
                vitals.push(diastolicComparator);
                vitals.push(diastolicValue);
                console.log('vitals');
                console.log(vitals);
            }
        }
        // reload store on grid
        form.up().down('#searchGrid').getStore().load();

    },

    onSubmitLabs: function (button) {
        var payload = Ext.getStore('Payload'),
            lab = [],
            form = button.up('form'),
            labComparator = form.down('#labComparator').value,
            labCode = form.down('#labCode').value,
            labDescription = form.down('#labCode').rawValue,
            labValue = form.down('#labValue').value,
            upperLab = form.down('#upperLab').value,
            labComparatorSecond = form.down('#labComparatorSecond').value,
            labCodeSecond = form.down('#labCodeSecond').value,
            labDescriptionSecond = form.down('#labCodeSecond').rawValue,
            labValueSecond = form.down('#labValueSecond').value,
            upperLabSecond = form.down('#upperLabSecond').value,
            labWhenComparator = form.down('#labWhenComparator').value,
            labWhenValue = form.down('#labWhenValue').value,
            upperLabWhen = form.down('#upperLabWhen').value,
            whenValue = Ext.Date.format(labWhenValue, 'Y-m-d'),
            upperWhenValue = Ext.Date.format(upperLabWhen, 'Y-m-d');



        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show object labs');
            console.log(form.down('#labCode'));
            console.log(labComparator);
            console.log(labCode);
            console.log(labValue);
            console.log(upperLab);
        }

        // insert only if exists
        if (labValue) {


            var test_lab = labValue,
                test_lab_second = labValueSecond,
                test_date = whenValue;


            if (labWhenComparator === 'bt') {

                if (!upperLabWhen) {
                    alert('Please enter max ilab to continue')
                }
                else {
                    test_date += ',' + upperWhenValue;
                }
            }


            if (labComparator === 'bt') {

                if (!upperLab) {
                    alert('Please enter max lab to continue')
                }
                else {
                    test_lab += ',' + upperLab;
                }
            }

            if (labComparatorSecond === 'bt') {

                if (!upperLabSecond) {
                    alert('Please enter max lab to continue')
                }
                else {
                    test_lab_second += ',' + upperLabSecond;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('test lab : ' + test_lab);
                console.log('test lab second: ' + test_lab_second);
            }

            if (((labComparator === 'bt' &&
                labValue &&
                upperLab) ||

                (!upperLab &&
                labComparator !== 'bt' &&
                labValue)) &&

                ((labComparatorSecond === 'bt' &&
                labValueSecond &&
                upperLabSecond) ||

                (!upperLabSecond &&
                labComparatorSecond !== 'bt' &&
                labValueSecond) ||

                (!labValueSecond))) {

                if (labValue) {
                    payload.add({
                        type: 'lab',
                        key: labCode,
                        value: test_lab,
                        comparator: labComparator,
                        comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(labComparator).toUpperCase(),
                        description: labDescription,
                        dateComparator: labWhenComparator,
                        dateComparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(labWhenComparator),
                        dateValue: test_date
                    });
                    payload.sync();
                }

                if (labValueSecond) {
                    payload.add({
                        type: 'lab',
                        key: labCodeSecond,
                        value: test_lab_second,
                        comparator: labComparatorSecond,
                        comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(labComparatorSecond).toUpperCase(),
                        description: labDescriptionSecond,
                        dateComparator: labWhenComparator,
                        dateComparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(labWhenComparator),
                        dateValue: test_date
                    });
                    payload.sync();
                }
            }
            else {
                // error conditions here
            }


            if (cardioCatalogQT.config.mode === 'test') {
                lab.push(labCode); // type
                lab.push(labComparator); // comparator
                lab.push(labValue); // comparator
                lab.push(upperLab); // comparator
                lab.push(labCodeSecond); // type
                lab.push(labComparatorSecond); // comparator
                lab.push(labValueSecond); // comparator
                lab.push(upperLabSecond); // comparator
                console.log('labs:');
                console.log(lab);
            }

        }
        // reload store on grid
        form.up().down('#searchGrid').getStore().load();
    },

    onSubmitDiagnoses: function(button) {
        var payload = Ext.getStore('Payload'),
            dx = [],
            form = button.up('form'),
            diagnoses = form.down('#diagnosis').store.data.items,
            diagnosisWhenComparator = form.down('#diagnosisWhenComparator').value,
            diagnosisWhenValue = form.down('#diagnosisWhenValue').value,
            upperDiagnosisWhen = form.down('#upperDiagnosisWhen').value,
            whenValue = Ext.Date.format(diagnosisWhenValue, 'Y-m-d'),
            upperWhenValue = Ext.Date.format(upperDiagnosisWhen, 'Y-m-d');

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show submitted Dx:');
            console.log(diagnoses);
        }

        Ext.Array.each(diagnoses, function (item) {

            var test_date = whenValue;

            if (diagnosisWhenComparator === 'bt') {

                if (!upperDiagnosisWhen) {
                    alert('Please enter max diagnosis to continue')
                }
                else {
                    test_date += ',' + upperWhenValue;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log(item)
            }


            // TODO: ensure record does not already exist
            payload.add({
                type: 'dx',
                key: 'dx_code',
                comparator: 'eq',
                comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash('eq'),
                value: item.data.code,
                description: item.data.description.toUpperCase(),
                dateComparator: diagnosisWhenComparator,
                dateComparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(diagnosisWhenComparator),
                dateValue: test_date
            });

            payload.sync();

            if (cardioCatalogQT.config.mode === 'test') {
                dx.push(item.data.code,item.data.description);
                console.log('dx');
                console.log(dx);
                console.log(payload);
            }

        }); // each()
        // reload store on grid
        form.up().down('#searchGrid').getStore().load();
    },

    onSubmitProcedures: function(button) {
        var payload = Ext.getStore('Payload'),
            px = [],
            form = button.up('form'),
            procedures = form.down('#procedure').store.data.items,
            procedureWhenComparator = form.down('#procedureWhenComparator').value,
            procedureWhenValue = form.down('#procedureWhenValue').value,
            upperProcedureWhen = form.down('#upperProcedureWhen').value,
            whenValue = Ext.Date.format(procedureWhenValue, 'Y-m-d'),
            upperWhenValue = Ext.Date.format(upperProcedureWhen, 'Y-m-d');

        // begin test Rx
        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show submitted Dx:');
            console.log(procedures);
        }

        Ext.Array.each(procedures, function (item) {

            var test_date = whenValue;

            if (procedureWhenComparator === 'bt') {

                if (!upperProcedureWhen) {
                    alert('Please enter max procedure to continue')
                }
                else {
                    test_date += ',' + upperWhenValue;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log(item)
            }

            // TODO: ensure record does not already exist
            payload.add({
                type: 'px',
                key: 'px_code',
                comparator: 'eq',
                comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash('eq'),
                value: item.data.code,
                description: item.data.description.toUpperCase(),
                dateComparator: procedureWhenComparator,
                dateComparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(procedureWhenComparator),
                dateValue: test_date
            });

            payload.sync();

            if (cardioCatalogQT.config.mode === 'test') {
                px.push(item.data.code,item.data.description);
                console.log('px');
                console.log(px);
                console.log(payload);
            }

        }); // each()
        // reload store on grid
        form.up().down('#searchGrid').getStore().load();
    },

    onSubmitMedications: function(button) {
        var payload = Ext.getStore('Payload'),
            rx = [],
            form = button.up('form'),
            medications = form.down('#medication').store.data.items,
            medicationWhenComparator = form.down('#medicationWhenComparator').value,
            medicationWhenValue = form.down('#medicationWhenValue').value,
            upperMedicationWhen = form.down('#upperMedicationWhen').value,
            whenValue = Ext.Date.format(medicationWhenValue, 'Y-m-d'),
            upperWhenValue = Ext.Date.format(upperMedicationWhen, 'Y-m-d');

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show submitted Rx:');
            console.log(medications);
        }

        Ext.Array.each(medications, function (item) {

            var test_date = whenValue;

            if (medicationWhenComparator === 'bt') {

                if (!upperMedicationWhen) {
                    alert('Please enter max medication to continue')
                }
                else {
                    test_date += ',' + upperWhenValue;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log(item)
            }

            // TODO: ensure record does not already exist
            payload.add({
                type: 'rx',
                key: 'rx_code',
                comparator: 'eq',
                comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash('eq'),
                value: item.data.code,
                description: item.data.description.toUpperCase(),
                dateComparator: medicationWhenComparator,
                dateComparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(medicationWhenComparator),
                dateValue: test_date
            });

            payload.sync();

            if (cardioCatalogQT.config.mode === 'test') {
                rx.push(item.data.code,item.data.description);
                console.log('rx');
                console.log(rx);
                console.log(payload);
            }

        }); // each()
        // reload store on grid
        form.up().down('#searchGrid').getStore().load();
    },

    onSelectionChange: function(sm, selections) {
        this.getReferences().removeButton.setDisabled(selections.length === 0);
    },

    onCriterionRemove: function (button) {
            var grid = button.up('grid'),
                selection = grid.getView().getSelectionModel().getSelection(),
                store = Ext.getStore('Payload');

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('grid');
                console.log(grid);
                console.log('selection');
                console.log(selection);
                console.log('store');
                console.log(store);
            }

            if (selection) {
                store.remove(selection);
                store.sync();
                if (cardioCatalogQT.config.mode === 'test') {
                    console.log('removed')
                    console.log(store)
                }
            }
            else {
                if (cardioCatalogQT.config.mode === 'test') {
                    console.log('nada')
                }
            }
        },

    onCriterionOr: function (button) {
        var options = {
                delimiter: '|'
            };

        cardioCatalogQT.service.UtilityService.assemble_bool(button, options);
    },

    onCriterionAnd: function (button) {
        var options = {
                delimiter: ';'
            };

        cardioCatalogQT.service.UtilityService.assemble_bool(button, options);
    }

});
