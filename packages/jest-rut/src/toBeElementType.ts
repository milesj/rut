import jest from 'jest';
import isRutNode from './isRutNode';

const toBeElementType: jest.CustomMatcher = (received, type) => {
  if (!isRutNode(received)) {
    throw new Error('toBeElementType: Expected a Rut node.');
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
