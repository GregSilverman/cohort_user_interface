/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */


// TODO: clear controls after submitting query

Ext.define('cardioCatalogQT.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-view',

    requires: [
        'Ext.window.MessageBox'
    ],

    onSubmitDemographics: function (button) {
        var atom,
            demo = [],
            form = button.up('grid'),
            sexValue = form.down('#sexValue').value,
            ageComparator = form.down('#ageComparator').value,
            ageValue = form.down('#ageValue').value,
            upperAgeValue = form.down('#upperAgeValue').value,
            criterion,
            vitalValue = form.down('#vitalStatus').value,
            comparatorValue = 'eq',
            raceValue = form.down('#raceValue').value,
            ethnicValue = form.down('#ethnicValue').value,
            race_value,
            ethnic_value;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show object demographics');
            console.log(sexValue);
            console.log(ageComparator);
            console.log(ageValue);
            console.log(upperAgeValue);
        }

        // insert sex only if exists
        if (sexValue) {

                // set value if ALL values desired for return
                if (sexValue === 'prn') {
                    comparatorValue = sexValue;
                    sexValue = 'all'
                }
                // TODO: implement citerion builder independent of all data in stores
                criterion = 'SEX' +
                    ' ' +
                    cardioCatalogQT.service.UtilityService.comparator_hash(comparatorValue) +
                    ' ' +
                    sexValue;

                // TODO: implement atomic_unit builder at time of model instance creation

                console.log('print: value')
                console.log(cardioCatalogQT.service.UtilityService.comparator_hash(comparatorValue))

                var payload = {
                    type: 'demographics',
                    key: 'sex',
                    comparator: 'eq',
                    comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(comparatorValue),
                    value: sexValue,
                    criteria: criterion,
                    atom: cardioCatalogQT.service.UtilityService.make_atom('demographics', 'sex', comparatorValue, sexValue)
                };

                atom = cardioCatalogQT.service.UtilityService.make_atom('demographics', 'sex', comparatorValue, sexValue);
                cardioCatalogQT.service.UtilityService.url(button, atom, 'NULL', payload);
        }
        // insert vitalStatus only if exists
        if (vitalValue){

            // set value if ALL values desired for return
            if (vitalValue === 'prn') {
                comparatorValue = vitalValue;
                vitalValue = 'all'
            }

            criterion = 'vital_status' +
                ' ' +
                cardioCatalogQT.service.UtilityService.comparator_hash('eq') +
                ' ' +
                vitalValue;

            var payload = {
                type: 'dg',
                key: 'vital_status',
                comparator: 'eq',
                comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(comparatorValue),
                value: vitalValue,
                criteria: criterion,
                atom: cardioCatalogQT.service.UtilityService.make_atom('demographics', 'vital_status', comparatorValue, vitalValue)
            };

            atom = cardioCatalogQT.service.UtilityService.make_atom('demographics', 'vital_status', comparatorValue, vitalValue);
            cardioCatalogQT.service.UtilityService.url(button, atom, 'NULL', payload);

        }

        else {
            // error conditions here
        }

        // insert only if exists
        if (ageValue || ageComparator === 'prn') {

            var test_age = ageValue;

            if (ageComparator === 'bt') {

                if (!upperAgeValue) {
                    alert('Please enter max age to continue')
                }
                else {
                    test_age += ',' + upperAgeValue;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('test age: ' + test_age);
            }

            // set value if ALL values desired for return
            if (ageComparator === 'prn') {
                test_age = 'all'
            }

            if ((ageComparator === 'bt' &&
                ageValue &&
                upperAgeValue) ||

                (!upperAgeValue &&
                (ageComparator !== 'bt') &&
                (ageValue || ageComparator === 'prn'))) {

                // TODO: implement citerion builder independent of all data in stores
                criterion = 'Age' +
                    ' ' +
                    cardioCatalogQT.service.UtilityService.comparator_hash(ageComparator) +
                    ' ' +
                    test_age;

                // TODO: implement atomic_unit builder at time of model instance creation

                var payload  = {
                    type: 'demographics',
                    key: 'age',
                    comparator: ageComparator,
                    comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(ageComparator),
                    value: test_age,
                    criteria: criterion,
                    atom: cardioCatalogQT.service.UtilityService.make_atom('demographics', 'age', ageComparator, test_age)
                };

                atom = cardioCatalogQT.service.UtilityService.make_atom('demographics', 'age', ageComparator, test_age);
                cardioCatalogQT.service.UtilityService.url(button, atom, 'NULL', payload);
            }
            else{
                // error conditions here
            }

        }

        // insert race only if exists
        if (raceValue) {

            // set value if ALL values desired for return
            if (sexValue === 'prn') {
                comparatorValue = raceValue;
                raceValue = 'all'
            }
            // TODO: implement citerion builder independent of all data in stores
            criterion = 'RACE' +
            ' ' +
            cardioCatalogQT.service.UtilityService.comparator_hash(comparatorValue) +
            ' ' +
            raceValue;

            race_value = raceValue.replace(new RegExp(' ', 'gi'),'_');

            // TODO: implement atomic_unit builder at time of model instance creation

            console.log('print: value')
            console.log(cardioCatalogQT.service.UtilityService.comparator_hash(comparatorValue))

            var payload = {
                type: 'demographics',
                key: 'race',
                comparator: 'eq',
                comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(comparatorValue),
                value: race_value,
                criteria: criterion,
                atom: cardioCatalogQT.service.UtilityService.make_atom('demographics', 'race', comparatorValue, race_value)
            };

            atom = cardioCatalogQT.service.UtilityService.make_atom('demographics', 'race', comparatorValue, race_value);
            cardioCatalogQT.service.UtilityService.url(button, atom, 'NULL', payload);
        }

        // insert ethnicity only if exists
        if (ethnicValue) {

            // set value if ALL values desired for return
            if (ethnicValue === 'prn') {
                comparatorValue = ethnicityValue;
                raceValue = 'all'
            }
            // TODO: implement citerion builder independent of all data in stores
            criterion = 'ETHNICITY' +
            ' ' +
            cardioCatalogQT.service.UtilityService.comparator_hash(comparatorValue) +
            ' ' +
            ethnicValue;

            ethnic_value = ethnicValue.replace(new RegExp(' ', 'gi'),'_');

            // TODO: implement atomic_unit builder at time of model instance creation

            console.log('print: value')
            console.log(cardioCatalogQT.service.UtilityService.comparator_hash(comparatorValue))

            var payload = {
                type: 'demographics',
                key: 'ethnicity',
                comparator: 'eq',
                comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(comparatorValue),
                value: ethnic_value,
                criteria: criterion,
                atom: cardioCatalogQT.service.UtilityService.make_atom('demographics', 'ethnicity', comparatorValue, ethnic_value)
            };

            atom = cardioCatalogQT.service.UtilityService.make_atom('demographics', 'ethnicity', comparatorValue, ethnic_value);
            cardioCatalogQT.service.UtilityService.url(button, atom, 'NULL', payload);
        }


        if (cardioCatalogQT.config.mode === 'test') {
            demo.push(sexValue);
            demo.push(ageComparator);
            demo.push(ageValue);
            demo.push(upperAgeValue);
            console.log('demographics:');
            console.log(Ext.ComponentQuery.query('#searchGrid')[0].getStore())
        }

    },

    onSubmitVitals: function(button) {
        var atom,
            vitals = [],
            form = button.up('grid'),
            measureCode = form.down('#measureCode').value,
            measureComparator = form.down('#measureComparator').value,
            measureValue = form.down('#measureValue').value,
            upperMeasureValue = form.down('#upperMeasureValue').value,
            whenComparator = form.down('#whenComparator').value,
            whenValue = form.down('#whenValue').value,
            upperWhenValue = form.down('#upperWhenValue').value,
            criterion,
            date_comparator;

        whenValue = Ext.Date.format(whenValue, 'Y-m-d');
        upperWhenValue = Ext.Date.format(upperWhenValue, 'Y-m-d');

        date_comparator = cardioCatalogQT.service.UtilityService.date_comparator_hash(whenComparator);

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('date comparator ');
            console.log(date_comparator);
            console.log('show object vitals');
            console.log(measureCode);
            console.log(measureComparator);
            console.log(measureValue);
            console.log(whenComparator);
            console.log(whenValue);
            console.log(upperWhenValue);
        }


        if (measureValue || measureComparator === 'prn') {

            var test_measure = measureValue,
                test_date = whenValue;

            if (whenComparator === 'bt') {

                if (!upperWhenValue) {
                    alert('Please enter max date to continue')
                }
                else {
                    test_date += ',' + upperWhenValue;
                }
            }

            if (measureComparator === 'bt') {

                if (!upperMeasureValue) {
                    alert('Please enter max measure to continue')
                }
                else {
                    test_measure += ',' + upperMeasureValue ;
                }
            }

            // set value if ALL values desired for return
            if (measureComparator === 'prn') {
                test_measure = 'all'
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('test measure : ' + test_measure);
                console.log('test date: ' + test_date);
                console.log('measure' + measureValue);
                console.log('measureComp' + measureComparator);
                console.log('measureUpper' + upperMeasureValue);
                console.log('when ' + whenValue);
                console.log('whenComp' + whenComparator);
                console.log('whenUpper' + upperWhenValue);
            }

            // insert only if exists
            if ((measureComparator === 'bt' &&
                measureValue &&
                upperMeasureValue) ||

                (!upperMeasureValue &&
                measureComparator !== 'bt' &&
                (measureValue || measureComparator === 'prn')) ||

                (!measureValue)) {

                criterion = measureCode.toUpperCase() +
                    ' ' +
                    cardioCatalogQT.service.UtilityService.comparator_hash(measureComparator) +
                    ' ' +
                    test_measure;

                if (test_date){
                    criterion += ' ' + 'in date range: ' + date_comparator + ' ' + ' '
                        + test_date;
                }

                // TODO: implement atomic_unit builder at time of model instance creation
                var payload = {
                    type: 'basic_vitals',
                    key: measureCode,
                    comparator: measureComparator,
                    comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(measureComparator),
                    value: test_measure,
                    dateComparator: whenComparator,
                    dateComparatorSymbol: cardioCatalogQT.service.UtilityService.date_comparator_hash(whenComparator),
                    dateValue: test_date,
                    criteria: criterion,
                    atom: cardioCatalogQT.service.UtilityService.make_atom('basic_vitals', measureCode, measureComparator, test_measure, whenComparator, test_date)
                };

                atom = cardioCatalogQT.service.UtilityService.make_atom('basic_vitals', measureCode, measureComparator, test_measure, whenComparator, test_date);
                cardioCatalogQT.service.UtilityService.url(button, atom, 'NULL', payload);
            }


            if (cardioCatalogQT.config.mode === 'test') {
                vitals.push(measureComparator);
                vitals.push(measureValue);
                console.log('vitals');
                console.log(vitals);
            }

        }

    },

    onSubmitLabs: function (button) {
        var atom,
            lab = [],
            form = button.up('grid'),
            labComparator = form.down('#labComparator').value,
            labCode = form.down('#labCode').value,
            labDescription = form.down('#labCode').rawValue,
            labValue = form.down('#labValue').value,
            upperLabValue = form.down('#upperLabValue').value,
            whenComparator = form.down('#whenComparator').value,
            whenValue = form.down('#whenValue').value,
            upperWhenValue = form.down('#upperWhenValue').value,
            criterion,
            date_comparator;

        whenValue = Ext.Date.format(whenValue, 'Y-m-d');
        upperWhenValue = Ext.Date.format(upperWhenValue, 'Y-m-d'),

        date_comparator = cardioCatalogQT.service.UtilityService.date_comparator_hash(whenComparator);

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show object labs');
            console.log(form.down('#labCode'));
            console.log(labComparator);
            console.log(labCode);
            console.log(labValue);
            console.log(upperLabValue);
        }

        // insert only if exists
        if (labValue || labComparator === 'prn') {

            var test_lab = labValue,
                test_date = whenValue;

            if (whenComparator === 'bt') {

                if (!upperWhenValue) {
                    alert('Please enter max date to continue')
                }
                else {
                    test_date += ',' + upperWhenValue;
                }
            }

            if (labComparator === 'bt') {

                if (!upperLabValue) {
                    alert('Please enter max lab to continue')
                }
                else {
                    test_lab += ',' + upperLabValue;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('test lab : ' + test_lab);
            }

            // set value if ALL values desired for return
            if (labComparator === 'prn') {
                test_lab = 'all'
            }

            if (((labComparator === 'bt' &&
                labValue &&
                upperLabValue) ||

                (!upperLabValue &&
                labComparator !== 'bt' &&
                (labValue || labComparator === 'prn')))) {

                // TODO: implement citerion builder independent of all data in stores
                criterion =  labCode +
                    ' ' +
                    cardioCatalogQT.service.UtilityService.comparator_hash(labComparator) +
                    ' ' +
                    test_lab;

                if (test_date){

                    criterion += ' ' + 'in date range: ' + date_comparator + ' ' + ' '
                        + test_date;
                }
                if (labValue || labComparator === 'prn') {
                    var payload = {
                        type: 'test_code',
                        key: labCode,
                        value: test_lab,
                        comparator: labComparator,
                        comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(labComparator).toUpperCase(),
                        description: labDescription,
                        dateComparator: whenComparator,
                        dateComparatorSymbol: date_comparator,
                        dateValue: test_date,
                        criteria: criterion,
                        atom: cardioCatalogQT.service.UtilityService.make_atom('test_code', labCode, labComparator, test_lab, whenComparator, test_date)
                    };

                    atom = cardioCatalogQT.service.UtilityService.make_atom('test_code', labCode, labComparator, test_lab, whenComparator, test_date);
                    cardioCatalogQT.service.UtilityService.url(button, atom, 'NULL', payload);
                }
                else {
                    // error conditions here
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                lab.push(labCode); // type
                lab.push(labComparator); // comparator
                lab.push(labValue); // comparator
                lab.push(upperLabValue); // comparator
                console.log('labs:');
                console.log(lab);
            }

        }
    },

    onSubmitDiagnoses: function(button) {
        var atom,
            dx = [],
            form = button.up('grid'),
            diagnoses = form.down('#diagnosis').store.data.items,
            whenComparator = form.down('#whenComparator').value,
            whenValue = form.down('#whenValue').value,
            upperWhenValue = form.down('#upperWhenValue').value,
            criterion,
            date_comparator;

            whenValue = Ext.Date.format(whenValue, 'Y-m-d');
            upperWhenValue = Ext.Date.format(upperWhenValue, 'Y-m-d');
            date_comparator = cardioCatalogQT.service.UtilityService.date_comparator_hash(whenComparator);

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show submitted Dx:');
            console.log(diagnoses);
        }

        Ext.Array.each(diagnoses, function (item) {

            var test_date = whenValue;

            if (whenComparator === 'bt') {

                if (!upperWhenValue) {
                    alert('Please enter max date to continue')
                }
                else {
                    test_date += ',' + upperWhenValue;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log(item)
            }

            // TODO: implement citerion builder independent of all data in stores
            criterion =  item.data.description;

            if (test_date){
                criterion += ' ' + 'in date range: ' + date_comparator + ' ' + ' '
                + test_date;
            }
            // TODO: ensure record does not already exist
            var payload = {
                type: 'dx_code',
                key: 'dx_code',
                comparator: 'eq',
                comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash('eq'),
                value: item.data.code,
                description: item.data.description.toUpperCase(),
                dateComparator: whenComparator,
                dateComparatorSymbol: date_comparator,
                dateValue: test_date,
                criteria: criterion,
                atom: cardioCatalogQT.service.UtilityService.make_atom('dx_code', 'dx_code', 'eq', item.data.code, whenComparator, test_date)
            };

            if (cardioCatalogQT.config.mode === 'test') {
                dx.push(item.data.code,item.data.description);
                console.log('dx');
                console.log(dx);
            }

            atom = cardioCatalogQT.service.UtilityService.make_atom('dx_code', 'dx_code', 'eq' , item.data.code, whenComparator, test_date);
            cardioCatalogQT.service.UtilityService.url(button, atom, 'NULL', payload);

        }); // each()
    },

    onSubmitProcedures: function(button) {
        var atom,
            px = [],
            form = button.up('grid'),
            procedures = form.down('#procedure').store.data.items,
            whenComparator = form.down('#whenComparator').value,
            whenValue = form.down('#whenValue').value,
            upperWhenValue = form.down('#upperWhenValue').value,
            criterion,
            date_comparator;

            whenValue = Ext.Date.format(whenValue, 'Y-m-d');
            upperWhenValue = Ext.Date.format(upperWhenValue, 'Y-m-d');
            date_comparator = cardioCatalogQT.service.UtilityService.date_comparator_hash(whenComparator);

        // begin test Px
        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show submitted Dx:');
            console.log(procedures);
        }

        Ext.Array.each(procedures, function (item) {

            var test_date = whenValue;

            if (whenComparator === 'bt') {

                if (!upperWhenValue) {
                    alert('Please enter max date continue')
                }
                else {
                    test_date += ',' + upperWhenValue;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log(item)
            }
            // TODO: implement citerion builder independent of all data in stores
            criterion =  item.data.description;

            if (test_date){
                criterion += ' ' + 'in date range: ' + date_comparator + ' ' + ' '
                + test_date;
            }

            // TODO: ensure record does not already exist
            var payload = {
                type: 'proc_code',
                key: 'proc_code',
                comparator: 'eq',
                comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash('eq'),
                value: item.data.code,
                description: item.data.description.toUpperCase(),
                dateComparator: whenComparator,
                dateComparatorSymbol: date_comparator,
                dateValue: test_date,
                criteria: criterion,
                atom: cardioCatalogQT.service.UtilityService.make_atom('proc_code', 'proc_code', 'eq', item.data.code, whenComparator, test_date)
            };


            if (cardioCatalogQT.config.mode === 'test') {
                px.push(item.data.code,item.data.description);
                console.log('px');
                console.log(px);
            }

            atom = cardioCatalogQT.service.UtilityService.make_atom('proc_code', 'proc_code', 'eq' , item.data.code, whenComparator, test_date);
            cardioCatalogQT.service.UtilityService.url(button, atom, 'NULL', payload);

        }); // each()
    },

    onSubmitMedications: function(button) {
        var rx = [],
            form = button.up('form'),
            selections = form.getSelectionModel().getSelection(),
            criterion,
            drug_key,
            drug_value,
            atom;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('selection:');
            console.log(form);
            console.log(selections);
        }

        Ext.each(selections, function (items) {

            drug_key = items.data.type;

            criterion = items.data.type + ' ' + items.data.name;

            if (!items.data.drug_code) {

                drug_key = items.data.type;
                drug_value = items.data.name;
                drug_value = drug_value.replace(new RegExp(' ', 'gi'),'_').
                    replace(new RegExp(Ext.String.escapeRegex('('), 'gi'),'{').
                    replace(new RegExp(Ext.String.escapeRegex(')'), 'gi'),'}').
                    replace(new RegExp(Ext.String.escapeRegex('&'), 'gi'),'and'); // RegEx to deal with special characters
            }
            else{
                drug_key = 'drug_code_orig';
                drug_value = items.data.drug_code;
            }

            var payload = {
                type: 'rx',
                key: drug_key,
                comparator: 'eq',
                comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash('eq'),
                value: drug_value,
                description: items.data.name.toUpperCase(),
                criteria: criterion,
                atom: cardioCatalogQT.service.UtilityService.make_atom('medications', drug_key, 'eq', drug_value)
            };

            atom = cardioCatalogQT.service.UtilityService.make_atom('medications', drug_key, 'eq', drug_value);
            cardioCatalogQT.service.UtilityService.url(button, atom, 'submitSaved', payload);

            if (cardioCatalogQT.config.mode === 'test') {
                console.log(drug_key);
                console.log('YESH');
                console.log(items);
                console.log(items.data.type + items.data.name + items.data.drug_code)
                rx.push(items.data.type,items.data.name,items.data.drug_code);
                console.log('rx');
                console.log(rx);
                console.log(atom);
            }

        }); // each()
    },

    // TODO: last run date and count
    onSubmitSaved: function(button) {
        var grid = button.up('grid'),
            selection = grid.getSelectionModel().getSelection(),
            atom,
            filtered = [],
            source = grid.store,
            store = Ext.getStore(source);

        if (selection) {

            // array of elements on which to filter
            Ext.Array.each(selection, function (item) {
                filtered.push(item.data.id);
            });

            source.clearFilter(true); // Clears old filters
            source.filter([ // filter on selected array elements
                {
                    filterFn: function (rec) {
                        return Ext.Array.indexOf(filtered, rec.get('id')) != -1;
                    }
                }
            ]);

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('filtered store id:');
                console.log(filtered);
            }
        }
        else {
            if (cardioCatalogQT.config.mode === 'test') {
                console.log('nada')
            }
        }

        source.each(function (rec) {

            if (cardioCatalogQT.config.mode === 'test') {
                console.log(rec)
            }

            var payload = {
                type: 'saved',
                key: rec.data.query_name,
                description: rec.data.criteria,
                criteria: rec.data.criteria,
                atom: rec.data.molecule
            };

            atom = rec.data.molecule;

            cardioCatalogQT.service.UtilityService.url(button, atom, 'submitSaved', payload);

        }); // each()

        store.clearFilter();
        grid.getStore().load();

    },

    onMedSelectionChange: function(selections, sm) {
        var rx = [];

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('meds:');
            console.log(selections);
            console.log(selections.selected.items);
        }

        test = selections.selected.items

        Ext.each(test, function (items) {

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('YESH')
                console.log(items)
                console.log(items.data.type + items.data.name)
                rx.push(items.data.type,items.data.name);
                console.log('rx');
                console.log(rx);
            }

        }); // each()

    },

    // custom control of toggling disabled status of form buttons
    // control which buttons being toggled by looking at store to which selected object is bound
    onSelectionChange: function(selections, sm) {

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('sm:');
            console.log(selections);
            console.log(selections.selected.items);
            console.log(Ext.ComponentQuery.query('#searchSelected'));

        }

        // control for disabling button on SavedQueries;
        if (selections.store.id.indexOf('queries') > -1) {
            if (Ext.ComponentQuery.query('#searchSelected')[0].disabled === true) {

                Ext.ComponentQuery.query('#searchSelected')[0].enable();
            }
            if (selections.selected.length === 0) {

                Ext.ComponentQuery.query('#searchSelected')[0].disable();
            }
        }

        // control for disabling buttons on category tab grids
        else {

            // Activate controls
            if (Ext.ComponentQuery.query('#removeButton')[0].disabled === true &&
                selections.selected.length > 0) {

                Ext.ComponentQuery.query('#removeButton')[0].enable();

            }
            if (Ext.ComponentQuery.query('#andButton')[0].disabled === true &&
                Ext.ComponentQuery.query('#orButton')[0].disabled === true &&
                selections.selected.length > 1) {

                Ext.ComponentQuery.query('#andButton')[0].enable();
                Ext.ComponentQuery.query('#orButton')[0].enable();
            }
            if (Ext.ComponentQuery.query('#notButton')[0].disabled === true &&
                Ext.ComponentQuery.query('#saveQuery')[0].disabled === true &&
                //Ext.ComponentQuery.query('#showResults')[0].disabled === true &&
                selections.selected.length === 1) {

                Ext.ComponentQuery.query('#notButton')[0].enable();
                Ext.ComponentQuery.query('#saveQuery')[0].enable();
                //Ext.ComponentQuery.query('#showResults')[0].enable();
            }

            // Deactivate controls
            if (selections.selected.length > 1 || selections.selected.length === 0) {

                Ext.ComponentQuery.query('#notButton')[0].disable();
                Ext.ComponentQuery.query('#saveQuery')[0].disable();
                //Ext.ComponentQuery.query('#showResults')[0].disable();
            }
            if (selections.selected.length < 2) {

                Ext.ComponentQuery.query('#andButton')[0].disable();
                Ext.ComponentQuery.query('#orButton')[0].disable();
            }
            if (selections.selected.length === 0) {

                Ext.ComponentQuery.query('#removeButton')[0].disable();
            }

        }
    },

    onCriterionRemove: function (button) {
        var grid = button.up('grid'),
            selection = grid.getView().getSelectionModel().getSelection(),
            store,
            // bind grid store as source
            source = grid.store;

        store = Ext.getStore(source);

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
                console.log('removed');
                console.log(store);
            }
        }
        else {
            if (cardioCatalogQT.config.mode === 'payload') {
                console.log('nada');
            }
        }
    },

    onCriterionOr: function (button) {
        var options = {
                    delimiter: '|'
            };

        cardioCatalogQT.service.UtilityService.assemble_boolean(button, options);
    },

    onCriterionAnd: function (button) {
        var options = {
                delimiter: '&'
            };

        cardioCatalogQT.service.UtilityService.assemble_boolean(button, options);
    },

    onCriterionNot: function (button) {
        var options = {
                delimiter: '~'
            };

        cardioCatalogQT.service.UtilityService.assemble_boolean(button, options);
    },

    onFilterSave: function (button) {

        cardioCatalogQT.service.UtilityService.query_move(button);
    },

    // grab query for display of all data
    onShowResults: function (button) {
        var grid = button.up('grid'),
            source = grid.store,
            store = Ext.getStore(source),
            selection = grid.getView().getSelectionModel().getSelection(),
            url = cardioCatalogQT.config.protocol,
            atom,
            filtered = [],
            payload = store;

        if (selection) {

            // array of elements on which to filter
            Ext.Array.each(selection, function (item) {
                filtered.push(item.data.id);
            });

            source.clearFilter(true); // Clears old filters
            source.filter([ // filter on selected array elements
                {
                    filterFn: function (rec) {
                        return Ext.Array.indexOf(filtered, rec.get('id')) != -1;
                    }
                }
            ]);

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('filtered store id:');
                console.log(filtered);
            }
        }
        else {
            if (cardioCatalogQT.config.mode === 'test') {
                console.log('nada')
            }
        }

        atom = store.data.items[0].data.atom;
        if (cardioCatalogQT.config.mode === 'test') {
            console.log('ATOM HERE:');
            console.log(atom);
            console.log(grid.up());
        }

        url += cardioCatalogQT.config.host;
        url += cardioCatalogQT.config.apiGetQ;

        Ext.ComponentQuery.query('#resultsGrid')[0].enable();

        cardioCatalogQT.service.UtilityService.submit_query(url, source, atom, payload);

        store.clearFilter();
        grid.getStore().load();
    }

});
