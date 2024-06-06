// Form.js
import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import FlexBetween from "../FlexBetween"; // Make sure FlexBetween is properly imported

const Form = ({
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  submitButtonLabel,
  toggleButtonLabel,
  togglePageType,
  isLoading,
}) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: initialValues,
    resolver: validationSchema,
  });

  const handleDropzoneChange = (acceptedFiles, name) => {
    setValue(name, acceptedFiles[0]);
  };

  const DropzoneField = ({ name, placeholder }) => {
    const { getRootProps, getInputProps } = useDropzone({
      accept: '.jpg,.jpeg,.png',
      multiple: false,
      onDrop: (acceptedFiles) => handleDropzoneChange(acceptedFiles, name),
    });

    return (
      <Box
        {...getRootProps()}
        border="2px dashed #000"
        p="1rem"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <input {...getInputProps()} />
        {!initialValues[name] ? (
          <p>{placeholder}</p>
        ) : (
          <FlexBetween>
            <Typography>{initialValues[name].name}</Typography>
          </FlexBetween>
        )}
      </Box>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        display="grid"
        gap="30px"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
      >
        {fields.map((field, index) => {
          if (field.type === "dropzone") {
            return (
              <Box
                key={index}
                gridColumn="span 4"
                border="1px solid #ccc"
                borderRadius="5px"
                p="1rem"
              >
                <DropzoneField name={field.name} placeholder={field.placeholder} />
              </Box>
            );
          } else {
            return (
              <TextField
                key={index}
                label={field.label}
                type={field.type}
                {...register(field.name)}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
                sx={{ gridColumn: `span ${field.span || 4}` }}
              />
            );
          }
        })}
      </Box>

      {/* BUTTONS */}
      <Box>
        <Button
          fullWidth
          type="submit"
          sx={{
            m: "2rem 0",
            p: "1rem",
            backgroundColor: "#000",
            color: "#fff",
            "&:hover": { backgroundColor: "#333" },
          }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : submitButtonLabel}
        </Button>
        <Typography
          onClick={togglePageType}
          sx={{
            textDecoration: "underline",
            color: "#000",
            "&:hover": { cursor: "pointer", color: "#333" },
          }}
        >
          {toggleButtonLabel}
        </Typography>
      </Box>
    </form>
  );
};

Form.propTypes = {
  initialValues: PropTypes.object.isRequired,
  validationSchema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["text", "password", "email", "dropzone"]).isRequired,
      span: PropTypes.number,
      placeholder: PropTypes.string,
    })
  ).isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
  toggleButtonLabel: PropTypes.string.isRequired,
  togglePageType: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default Form;
