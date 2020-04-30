const httpMocks = require('node-mocks-http');
const tourController = require('../../controllers/tourController');
const TourModel = require('../../models/tourModel');
const newTourData = require('../mock_data/newTour.json');

let req;
let res;
let next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = null;
});

// console.log('new tour is :::', newTourData);
describe('+ test on tour controller .', () => {
  describe('+ + testing methode create Tour ..', () => {
    // test 1
    beforeEach(() => {
      req.body = newTourData;
    });

    it('createTour should be a function ...', () => {
      expect(typeof tourController.createTour).toBe('function');
    });

    //test 2
    TourModel.create = jest.fn();
    it('tourModel save should be called', () => {
      //1- le middleware createTour a comme params req, res; alors preparer les, on a mis ceci dans la fct beforeEach() pour eviter la duplication du code pcq on a besoin de req, res, next dans tous les tests
      // 2- la requete contient donnees au niveau de body, so preparer ses donnees et l importer et l utiliser

      //mettre le mock data dans req body
      // req.body = newTourData;
      tourController.createTour(req, res);
      expect(TourModel.create).toBeCalledWith(newTourData);
    });

    it('should return code status 201', () => {
      tourController.createTour(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._isJSON()).toBeTruth();
    });

    it('should return json data', () => {
      // on doit faire un mock pour la fct du model create pour qu'il nous return ce qu on va attendre
      TourModel.create.mockReturnValue(newTourData);
      tourController.createTour(req, res);
      // const returnValue = {
      //   status: 'success',
      //   data: {
      //     tour: newTourData,
      //   },
      // };
      // console.log(res._getData());
      expect(JSON.parse(res._getData())).toStringEqual(newTourData);
    });
  });
});
