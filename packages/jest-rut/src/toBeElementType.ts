import isRutElement from './isRutElement';

const toBeElementType: jest.CustomMatcher = (received, type) => {
  if (!isRutElement(received)) {
    throw new Error('toBeElementType: Expected a `RutElement`.');
  }

  if (received.type() === type) {
    return {
      message: 'expected type not to be an element',
      pass: true,
    };
  }

  return {
    message: 'expected type to be an element',
    pass: false,
  };
};

export default toBeElementType;
