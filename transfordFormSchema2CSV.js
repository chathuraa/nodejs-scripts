import * as fs from 'fs';
import { parse } from 'json2csv';

interface Option {
  label: string;
}

interface FieldConfig {
  label: string;
  required?: boolean;
  optionList?: Option[];
}

interface Field {
  config: FieldConfig;
  type: string;
}

interface Section {
  label: string;
  field: Field[];
}

interface Page {
  label: string;
  section: Section[];
}

interface Stage {
  page: Page[];
}

interface FormSchema {
  stage: Stage[];
}

const extractDataFromSchemaWithOptions = (schema: FormSchema) => {
  const extractedData: Array<{ pageLabel: string; sectionLabel: string; fieldLabel: string; required: string; fieldType: string; options: string }> = [];

  schema.stage.forEach(stage => {
    stage.page.forEach(page => {
      page.section.forEach(section => {
        section.field.forEach(field => {
          const fieldLabel = field.config.label;
          const required = field.config.required ? 'Yes' : 'No';
          const fieldType = field.type;
          let options = '';
          if (field.config.optionList && field.config.optionList.length > 0) {
            options = field.config.optionList.map(option => option.label).join(', ');
          }
          extractedData.push({
            pageLabel: page.label,
            sectionLabel: section.label,
            fieldLabel,
            required,
            fieldType,
            options,
          });
        });
      });
    });
  });

  return extractedData;
};

const generateCSVFromDataWithOptions = (data: Array<{ pageLabel: string; sectionLabel: string; fieldLabel: string; required: string; fieldType: string; options: string }>): string => {
  try {
    const csv = parse(data, { fields: ["pageLabel", "sectionLabel", "fieldLabel", "required", "fieldType", "options"] });
    return csv;
  } catch (err) {
    console.error('Error generating CSV:', err);
    return '';
  }
};

const main = () => {
  // Assuming schema is loaded from a JSON file or another source
  const schema: FormSchema = JSON.parse(fs.readFileSync('./path_to_your_json_schema.json', 'utf8'));
  const extractedData = extractDataFromSchemaWithOptions(schema);
  const csvContent = generateCSVFromDataWithOptions(extractedData);

  // Here you would typically save the CSV content to a file or handle it according to your application's needs.
  fs.writeFileSync('./extracted_form_data_with_options.csv', csvContent);
  console.log('CSV file has been generated successfully.');
};

main();
