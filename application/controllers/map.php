<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Map extends CI_Controller {

    public function load($level = '0')
    {
        $this->load->model('map_model');
        echo $this->map_model->get_map($level);
    }
}

/* End of file map.php */
/* Location: ./application/controllers/map.php */